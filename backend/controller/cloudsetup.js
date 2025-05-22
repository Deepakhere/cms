import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: 'deepakgupta',
    api_key: "713511489812892",
    api_secret: "bKtOxidI9ZC10j1UBpzJPiMEAfg",
});
console.log('coming...')

export default cloudinary;