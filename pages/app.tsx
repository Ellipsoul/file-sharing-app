import { Button } from "@mui/material";
import { ReactElement, useEffect, useState } from "react";

import { auth, googleAuthProvider } from "../lib/firebase";
import { getDownloadURL, getMetadata, listAll, ref, StorageReference, uploadBytesResumable,
  UploadMetadata, UploadTaskSnapshot } from "firebase/storage";
import { signInWithPopup } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import InsertDriveFileRoundedIcon from "@mui/icons-material/InsertDriveFileRounded";
import { FileUploader } from "react-drag-drop-files";

import { storage } from "../lib/firebase";

interface FileInfo {
  name: string;
  downloadUrl: string;
  reference: StorageReference;
}

export default function App(): ReactElement {
  // Tracking user authentication state
  const [user, loading, error] = useAuthState(auth);

  // Tracking uploaded file
  const [file, setFile] = useState<File | null>(null);
  // Runs whenever a file is uploaded
  const handleFileDrop = (file: File) => setFile(file);
  // Empties the file state
  const clearFile = () => setFile(null);

  const [uploadingFile, setUploadingFile] = useState(false);
  const [retrievingFiles, setRetrievingFiles] = useState(false);

  const [uploadedFiles, setUploadedFiles] = useState<FileInfo[]>([]);

  // Retrieves the uploaded files for the user on load
  useEffect(() => {
    if (!user || uploadedFiles.length) return;
    setRetrievingFiles(true);
    const listRef = ref(storage, user.uid);

    // Asynchronous function that retrieves the uploaded files
    async function fetchUploadedFiles() {
      try {
        // First attempt to retrieve files from the user's storage
        const files = await listAll(listRef);
        files.items.forEach(async (fileRef) => {
          try {
            // Loop through the files and retrieve their metadata and download URL
            const metadata = await getMetadata(fileRef);
            const downloadURL = await getDownloadURL(fileRef);
            // Add the file to the state
            setUploadedFiles((currentFiles) => [...currentFiles, {
              name: metadata.customMetadata!.name,
              downloadUrl: downloadURL,
              reference: fileRef,
            }]);
          } catch (e) {
            console.error(e);
          }
        });
      } catch (e) {
        console.error(e);
      } finally {
        setRetrievingFiles(false);
      }
    }

    fetchUploadedFiles();
  }, [user]);

  // Uploads the file to firebase storage
  const uploadFile = async () => {
    // Temporarily don't allow non-authenticated users to upload files
    if (!user) {
      throw new Error("User not logged in");
    }
    // Create the file reference with the unique unix timestamp
    const fileRef: StorageReference = ref(storage, `${user.uid}/${Date.now()}`);
    const metaData: UploadMetadata = {
      contentType: file!.type,
      customMetadata: {
        name: file!.name,
      },
    };

    setUploadingFile(true);
    // Upload file to firebase storage
    const uploadTask = uploadBytesResumable(fileRef, file as Blob, metaData);

    uploadTask.on("state_changed",
      (snapshot: UploadTaskSnapshot) => {
        // Track progress of the upload
        const uploadProgress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(`Upload is ${uploadProgress}% done`);
      },
      (error: Error) => console.error(error),
      () => {
        // Upload completed successfully, update state of files
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL: string) => {
          console.log(downloadURL);
          setUploadedFiles((currentFiles) => [...currentFiles, {
            name: file!.name,
            downloadUrl: downloadURL,
            reference: fileRef,
          }]);
          setUploadingFile(false);
          clearFile();
        });
      },
    );
  };

  // Convert bytes number to a nicer string
  function niceBytes(n: number): string {
    const units = ["bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    let l = 0;
    while (n >= 1024 && ++l) {
      n = n/1024;
    }
    return (n.toFixed(n < 10 && l > 0 ? 1 : 0) + " " + units[l]);
  }

  // Button for Google Sign In
  function GoogleSignInButton(): ReactElement {
    const signInWithGoogle = async () => {
      try {
        await signInWithPopup(auth, googleAuthProvider);
      } catch (error) {
        console.log(error);
      }
    };

    return (
      <Button
        className="
        px-4 py-2 rounded-xl flex flex-col
        bg-slate-700 dark:bg-slate-50 hover:bg-slate-800 dark:hover:bg-slate-200"
        variant="contained"
        color="primary"
        onClick={signInWithGoogle}>
        <span className="text-white dark:text-slate-800 text-lg block">
          Sign in With Google
        </span>
      </Button>
    );
  }

  // Button for Sign Out
  function SignOutButton(): ReactElement {
    const signOut = async () => {
      try {
        await auth.signOut();
      } catch (error) {
        console.log(error);
      }
    };

    return (
      <Button
        className="
        px-4 py-2 rounded-xl flex flex-col
        bg-slate-700 dark:bg-slate-50 hover:bg-slate-800 dark:hover:bg-slate-200"
        variant="contained"
        color="primary"
        onClick={signOut}>
        <span className="text-white dark:text-slate-800 text-lg block">
          Sign Out
        </span>
      </Button>
    );
  }

  // Left side for uploading a file
  const UploadFileSection = () => {
    return (
      <section className="
        bg-neutral-100 dark:bg-neutral-800 border-2 border-neutral-300 dark:border-neutral-600
        flex flex-col justify-start items-stretch gap-y-2 md:gap-y-4 w-full md:w-9/20
        p-2 md:p-4 drop-shadow-xl"
      >
        {/* Header */}
        <header className="
        font-heading text-3xl md:text-4xl text-black dark:text-white text-center">
        Upload File
        </header>
        {/* Draggable zone to upload a file */}
        <FileUploader
          name="file"
          label={file?.name || "No file selected"}
          file={file}
          handleChange={handleFileDrop}
          classes={
            `file-uploader ${file ?
              "border-green-400 dark:border-green-700":
              "border-zinc-300 dark:border-zinc-500" }`}
          hoverTitle=" "
        >
          {/* Display file information if a file is uploaded, otherwise prompt upload */}
          { file ?
            <div className="
            flex flex-col h-full justify-evenly items-center p-3 sm:p-6 md:p-12
            text-lg md:text-xl lg:text-2xl text-center font-slogan font-light
            text-black dark:text-white">
              <span className="text-7xl">
                <InsertDriveFileRoundedIcon fontSize="inherit" />
              </span>
              <div className="w-full">{file.name}</div>
              <div className="">{`Size: ${niceBytes(file.size)}`}</div>
            </div> :
            <div className="
          flex flex-col h-full justify-evenly items-center p-6 sm:p-12
          text-2xl md:text-3xl lg:text-4xl text-center font-slogan font-light
          text-black dark:text-white">
              <div className="">Drag&apos;n&apos;Drop File Here</div>
              <div className="">Max Size: 100MB</div>
            </div>
          }
        </FileUploader>
        {/* Clear and Upload File Buttons */}
        <div className="flex flex-row justify-evenly items-center px-2 gap-4">
          {/* Clear */}
          <Button className="
          h-16 md:h-24 px-4 py-2 rounded-xl flex flex-row grow
        bg-red-600 hover:bg-red-500"
          variant="contained"
          onClick={clearFile}
          disabled={!file}>
            <span
              className={ `${file ? "text-white" :
                "text-neutral-200 dark:text-neutral-600"} text-2xl md:text-3xl block`}
            >
            Clear
            </span>
          </Button>
          {/* Upload */}
          <Button
            className="
            h-16 md:h-24 px-4 py-2 rounded-xl
            flex flex-row grow-2 bg-green-500 hover:bg-green-400"
            variant="contained"
            disabled={!file}
            onClick={uploadFile}
          >
            <span
              className={`${file ? "text-white" :
                "text-neutral-200 dark:text-neutral-600"} text-2xl md:text-3xl block`}
            >
            Upload
            </span>
          </Button>
        </div>
      </section>
    );
  };

  // Right side for displaying the files uploaded
  const FileListSection = () => {
    return (
      <section className="
      bg-neutral-100 dark:bg-neutral-800 border-2 border-neutral-300 dark:border-neutral-600
        flex flex-col justify-start items-stretch gap-y-2 md:gap-y-4
        w-full max-h-full md:w-9/20 p-2 md:p-4 drop-shadow-xl"
      >
        <div className="font-serif text-center text-2xl md:text-3xl">Uploaded Files</div>
        <div className="
          flex flex-col grow min-h-48 max-h-96
          border-2 border-zinc-300 rounded-lg p-2 overflow-y-scroll
        ">
          {uploadedFiles.map((file, index) => (
            <div key={index}>
              <div>{file.name}</div>
              <div>{file.downloadUrl}</div>
            </div>
          ))}
        </div>
        {user ? <SignOutButton /> : <GoogleSignInButton />}
        <span>{user ? user.uid : "Signed Out"}</span>
        <span>{`Retrieving: ${retrievingFiles}`}</span>
      </section>
    );
  };


  return (
    <main className="
      grow flex flex-col md:flex-row justify-start md:justify-evenly items-stretch px-4 md:px-0 py-4
      flex-wrap gap-y-5">
      <UploadFileSection />
      <FileListSection />
    </main>
  );
}
