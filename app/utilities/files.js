import * as FileSystem from "expo-file-system";

export const mp3Folder = FileSystem.documentDirectory;

export async function GetFileInfo(mp3) {
  try {
    return await FileSystem.getInfoAsync(mp3Folder + mp3);
  } catch (e) {
    console.error(e);
  }
}
export const CheckFileExist = (mp3) => {
  try {
    getFileInfo(mp3).then((result) => {
      console.log("CheckFileExist: " + mp3Folder + mp3 + ": " + result.exists);
      return result.exists;
    });
  } catch (e) {
    console.error(e);
    return false;
  }
};

const downloadCallback = (downloadProgress) => {
  const download_percentage =
    (downloadProgress.totalBytesWritten /
      downloadProgress.totalBytesExpectedToWrite) *
    100;
    downloadHandler(download_percentage);
};


let downloadHandler = function handler(){};
let fileHandler = function handler(){};

export async function DownloadFile(mp3, handler) {
  downloadHandler = handler;
  try {
    console.log("downloadResumable downloadAsync");
    const downloadResumable = FileSystem.createDownloadResumable(
      "https://exchangepromise.com/fo/" + mp3, //remote url
      mp3Folder + mp3, //target uri
      {}, //options: md5, header
      downloadCallback //callback progress
    );
    return await downloadResumable.downloadAsync();
  } catch (e) {
    console.log("DownloadFile error");
    downloadHandler(0, e);
  }
}

export async function DeleteFiles(mp3, handler) {
  fileHandler = handler;
  try {
    console.log("deleteAsync started");
    return await FileSystem.deleteAsync(mp3Folder + mp3);
  } catch (e) {    
    console.log("Deleting error");
    fileHandler(0, e);
  }
}

// class Download {}

// const fileInfo = new FileInfo();
// export default fileInfo;
