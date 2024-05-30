exports.registerPembeli = [
    upload.single('photo_url'),
    async (req, res) => {
        try {
            const { nama, email, telepon, password, alamat } = req.body;
            const photo = req.file;

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            let photo_url = null;
            if (photo) {
                const blob = bucket.file(Date.now() + path.extname(photo.originalname));
                const blobStream = blob.createWriteStream({
                    metadata: {
                        contentType: photo.mimetype
                    }
                });

                blobStream.on('error', error => {
                    throw new Error('Something is wrong! Unable to upload at the moment.');
                });

                blobStream.on('finish', async () => {
                    // Get the download token
                    const [metadata] = await blob.getMetadata();
                    const downloadToken = metadata.metadata.firebaseStorageDownloadTokens;

                    // Construct the photo URL with the download token
                    photo_url = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(blob.name)}?alt=media&token=${downloadToken}`;

                    const result = await Pembeli.create({
                        nama,
                        email,
                        telepon,
                        password: hashedPassword,
                        alamat,
                        photo_url // Save the photo URL with the download token
                    });

                    response(201, result, "Successfully registered", res);
                });

                blobStream.end(photo.buffer);
            } else {
                const result = await Pembeli.create({
                    nama,
                    email,
                    telepon,
                    password: hashedPassword
                });

                response(201, result, "Successfully registered", res);
            }
        } catch (error) {
            response(500, error, "Registration error", res);
        }
    }
];