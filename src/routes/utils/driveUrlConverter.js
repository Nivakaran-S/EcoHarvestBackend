// utils/driveUrlConverter.js
function convertDriveUrl(shareUrl) {

    if (shareUrl.includes('uc?id=') || shareUrl.includes('uc?export=')) {
      return shareUrl;
    }
  
    const regex = /\/d\/([a-zA-Z0-9-_]+)|id=([a-zA-Z0-9-_]+)/;
    const match = shareUrl.match(regex);
    
    if (!match) return shareUrl; 
    
    const fileId = match[1] || match[2];
    return `https://drive.google.com/uc?export=view&id=${fileId}`;
  }
  
  module.exports = { convertDriveUrl };
  