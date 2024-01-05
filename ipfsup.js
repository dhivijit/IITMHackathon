const axios = require('axios')
const FormData = require('form-data')
const fs = require('fs')
const JWT = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJkODBjMjkyYi04YTFmLTQwZGMtOGU0YS1hMmZlZjA4YjA5MzMiLCJlbWFpbCI6ImhlYXRoa25vd2xlczY2MkBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJpZCI6IkZSQTEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX0seyJpZCI6Ik5ZQzEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiOTU4Mzc0NTU5MDUxMmZiYmU1ZDgiLCJzY29wZWRLZXlTZWNyZXQiOiJlMWRmZjYwZGM0YzcyZjE0YzEwNWM2OWNmNjU1NTFlMzZjODZjNGY1M2JjOWFiOWFhZjMyM2NmNjJiYzE1NjE5IiwiaWF0IjoxNzA0NDQyNDE4fQ.L0Kmyx4aIgHTHUVHfVUPhVi3jbEz1a433jgbyUm0xSk

const pinFileToIPFS = async () => {
    const formData = new FormData();
    const src = "data.json";
    
    const file = fs.createReadStream(src)
    formData.append('file', file)
    
    const pinataMetadata = JSON.stringify({
      name: 'File',
    });
    formData.append('pinataMetadata', pinataMetadata);
    
    const pinataOptions = JSON.stringify({
      cidVersion: 0,
    })
    formData.append('pinataOptions', pinataOptions);

    try{
      const res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
        maxBodyLength: "Infinity",
        headers: {
          'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
          'Authorization': `Bearer ${JWT}`
        }
      });
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
}
pinFileToIPFS()
