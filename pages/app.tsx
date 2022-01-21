import { Button } from "@mui/material";
import { ReactElement, useEffect, useState } from "react";

import { auth, googleAuthProvider } from "../lib/firebase";
import { getDownloadURL, getMetadata, listAll, ref, StorageReference, uploadBytesResumable,
  UploadMetadata, UploadTaskSnapshot, getBlob } from "firebase/storage";
import { signInWithPopup } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import IosShareRoundedIcon from "@mui/icons-material/IosShareRounded";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";

import UploadFileSection from "../components/App_Components/UploadFileSection";
import { storage } from "../lib/firebase";
import { DownloadForOfflineOutlined } from "@mui/icons-material";

interface FileInfo {
  name: string;
  downloadUrl: string;
  reference: StorageReference;
}

export default function App(): ReactElement {
  // Tracking user authentication state
  const [user, loading, error] = useAuthState(auth);

  // Empties the file state
  const clearFile = () => setFile(null);
  // Tracking uploaded file
  const [file, setFile] = useState<File | null>(null);

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

  // Download the file from firebase storage using the storage reference
  function downloadFile(storageRef: StorageReference, fileName: string): void {
    getBlob(storageRef).then((blob) => {
      const url = window.URL.createObjectURL(blob); // Grab the url of the file
      const a = document.createElement("a"); // Create a link element in the dom
      a.href = url; // Add the url to the link element
      a.download = fileName; // Add the file name to the link element
      a.click(); // Click the element
      a.remove(); // Clean up the element
    });
  }

  interface FileActionProps {
    file: FileInfo;
  }

  const FileActions = ({file}: FileActionProps) => {
    return (
      <div className="
        flex flex-col justify-start items-center gap-y-1 rounded-lg w-full
        p-3 bg-zinc-200 dark:bg-slate-600 font-heading break-all
      ">
        <div className="text-md">{file.name}</div>
        <div className="flex flex-row w-full p-1 gap-x-2 justify-between">
          <Button className="
            h-9 px-2 py-4 rounded-xl flex flex-row grow
            bg-green-500 hover:bg-green-400"
          variant="contained">
            <span className="text-md hidden sm:block">Share</span>
            <IosShareRoundedIcon fontSize="medium" className="block sm:hidden"/>
          </Button>
          <Button className="
            h-9 px-2 py-4 rounded-xl flex flex-row grow
            bg-slate-700 dark:bg-slate-50 hover:bg-slate-800 dark:hover:bg-slate-200"
          variant="contained"
          onClick={() => downloadFile(file.reference, file.name)}>
            <span className="text-md text-white dark:text-black hidden sm:block">Download</span>
            <DownloadRoundedIcon fontSize="medium" className="block sm:hidden"/>
          </Button>
          <Button className="
            h-9 px-2 py-4 rounded-xl flex flex-row grow
          bg-red-600 hover:bg-red-500"
          variant="contained">
            <span className="text-md hidden sm:block">Delete</span>
            <DeleteRoundedIcon fontSize="medium" className="block sm:hidden"/>
          </Button>
        </div>
      </div>
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
          flex flex-col grow min-h-48 max-h-96 gap-y-2
          border-2 border-zinc-300 rounded-lg p-3 overflow-y-scroll
        ">
          {/* Map the uploaded files to a file component */}
          {uploadedFiles.map((file, index) => (
            <FileActions file={file} key={index} />
          ))}
        </div>
        {user ? <SignOutButton /> : <GoogleSignInButton />}
        <span>{`Retrieving: ${retrievingFiles}`}</span>
      </section>
    );
  };


  return (
    <main className="
      grow flex flex-col md:flex-row justify-start md:justify-evenly items-stretch px-4 md:px-0 py-4
      flex-wrap gap-y-5">
      <UploadFileSection
        file={file}
        setFile={setFile}
        clearFile={clearFile}
        uploadFile={uploadFile}
      />
      <FileListSection />
    </main>
  );
}
