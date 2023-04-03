import { BlobServiceClient, ContainerClient } from "@azure/storage-blob";
import { v4 as uuidv4 } from "uuid";

const containerName: any = process.env.AZURE_CONTAINER_NAME;
const sasToken: any = process.env.AZURE_SAS_TOKEN;
const storageAccountName: any = process.env.AZURE_STORAGE_ACCOUNT;

export const uploadFileToBlob = async (file: any): Promise<string> => {
  if (!file) return "";

  let lastIndex = file.originalname.lastIndexOf(".");
  let mediaType = file.originalname.slice(lastIndex, file.originalname.length);
  let image = file.originalname.slice(0, lastIndex);
  let imageName = uuidv4(image);
  let imageType = mediaType;

  // get BlobService = notice `?` is pulled out of sasToken - if created in Azure portal
  const blobService = new BlobServiceClient(
    `https://${storageAccountName}.blob.core.windows.net/?${sasToken}`
  );

  // get Container - full public read access
  const containerClient: ContainerClient =
    blobService.getContainerClient(containerName);

  // create blobClient for container
  const blobClient = containerClient.getBlockBlobClient(imageName + imageType);

  // upload file
  await blobClient.uploadFile(file.path);

  const imageURL: string = `https://${storageAccountName}.blob.core.windows.net/${containerName}/${
    imageName + imageType
  }`;

  return imageURL;
};

export const deleteFileToBlob = async (fileUrl: string) => {
  // get BlobService = notice `?` is pulled out of sasToken - if created in Azure portal
  const blobService = new BlobServiceClient(
    `https://${storageAccountName}.blob.core.windows.net/?${sasToken}`
  );

  // get Container - full public read access
  const containerClient: ContainerClient =
    blobService.getContainerClient(containerName);

  const blobName = fileUrl.split("/")[4];

  const blobClient = containerClient.getBlobClient(blobName);

  // Check if the file exists
  const exists = await blobClient.exists();
  if (exists) {
    // Delete the file
    const response: any = await blobClient.delete();

    return response;
  } else {
    console.log(`File ${fileUrl} does not exist.`);
  }
};
