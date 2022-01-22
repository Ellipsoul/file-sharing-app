import { Button } from "@mui/material";
import { ReactElement, useEffect, useState } from "react";

import { auth, googleAuthProvider } from "../lib/firebase";
import { getDownloadURL, getMetadata, listAll, ref, StorageReference, uploadBytesResumable,
  UploadMetadata, UploadTaskSnapshot, getBlob, deleteObject } from "firebase/storage";
import { signInAnonymously, signInWithPopup } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { toast } from "react-hot-toast";
import { useTheme } from "next-themes";
import { BallTriangle } from "react-loader-spinner";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import IosShareRoundedIcon from "@mui/icons-material/IosShareRounded";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import GoogleIcon from "@mui/icons-material/Google";

import UploadFileSection from "../components/App_Components/UploadFileSection";
import { storage } from "../lib/firebase";

interface FileInfo {
  name: string;
  downloadUrl: string;
  reference: StorageReference;
}

export default function App(): ReactElement {
  const { theme } = useTheme();
  const toasterStyle = {
    background: theme === "dark" ? "black" : "white",
    color: theme === "dark" ? "white" : "black",
  };

  // Tracking user authentication state
  const [user, loading, error] = useAuthState(auth);

  // Empties the file state
  const clearFile = () => setFile(null);
  // Tracking uploaded file
  const [file, setFile] = useState<File | null>(null);

  const [uploadingFile, setUploadingFile] = useState(false);
  const [retrievingFiles, setRetrievingFiles] = useState(false);
  const [uploadFileProgress, setUploadFileProgress] = useState(0);

  const [uploadedFiles, setUploadedFiles] = useState<FileInfo[]>([]);

  // Retrieves the uploaded files for the user on load
  useEffect(() => {
    if (!user || user.isAnonymous || uploadedFiles.length) return;
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
    if (file!.size > 104_857_600) {
      toast.error("File is too large", {
        icon: "❌",
        style: toasterStyle,
      });
      clearFile();
      return;
    }

    // Get the extension of the file
    const extension = file!.name.split(".").pop() || "";

    // Create the file reference with the unique unix timestamp
    const fileRef: StorageReference =
      ref(storage, `${auth.currentUser!.uid}/${Date.now()}.${extension}`);
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
        const uploadProgress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        setUploadFileProgress(uploadProgress);
        console.log(`Upload is ${uploadProgress}% done`);
      },
      (error: Error) => console.error(error),
      () => {
        // Upload completed successfully, update state of files
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL: string) => {
          setUploadedFiles((currentFiles) => [...currentFiles, {
            name: file!.name,
            downloadUrl: downloadURL,
            reference: fileRef,
          }]);
          setUploadingFile(false);
          clearFile();
          toast.success("File uploaded!", {
            icon: "✅",
            style: toasterStyle,
          });
          setOpenDialog(true);
          navigator.clipboard.writeText(downloadURL); // Copy to clipboard
          // Sign the user out if anonymous
          if (auth.currentUser!.isAnonymous) {
            auth.signOut();
          };
        });
      },
    );
  };

  // Check if the user is signed in before uploading a file
  const checkBeforeUploadFile = async () => {
    if (!user) {
      signInAnonymously(auth).then(() => {
        uploadFile();
      });
    } else {
      uploadFile();
    }
  };

  const [openDialog, setOpenDialog] = useState(false);

  const handleClose = () => {
    setOpenDialog(false);
  };

  function UploadedDialog(): ReactElement {
    return (
      <div>
        <Dialog
          open={openDialog}
          onClose={handleClose}
          aria-labelledby="uploaded-file-dialog-title"
          aria-describedby="uploaded-file-dialog-description"
        >
          <DialogTitle id="uploaded-file-dialog-title" className="text-2xl">
            Uploaded and Copied to Clipboard!
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="uploaded-file-dialog-description" className="text-lg">
              File uploaded successfully! The shareable link has been copied to your clipboard
            </DialogContentText>
            <DialogContentText>
              {!user || user.isAnonymous ?
                "Please sign in with Google to save and manage your uploaded files!" :
                `Thanks for logging in with Google!
                You can manage your files using the righthand panel`}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              variant="outlined"
              onClick={handleClose}
              autoFocus
              className="text-black"
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }

  // Button for Google Sign In
  function GoogleSignInButton(): ReactElement {
    const signInWithGoogle = async () => {
      try {
        await signInWithPopup(auth, googleAuthProvider);
        toast.success("Signed in with Google!", {
          icon: "✅",
          style: toasterStyle,
        });
      } catch (error) {
        console.log(error);
      }
    };

    return (
      <Button
        className="
        px-4 py-2 rounded-xl flex flex-row gap-x-3 items-start
        bg-slate-700 dark:bg-slate-50 hover:bg-slate-800 dark:hover:bg-slate-200"
        variant="contained"
        color="primary"
        onClick={signInWithGoogle}>
        <span className="text-white dark:text-black"><GoogleIcon /></span>
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
        toast.success("Signed out!", {
          icon: "🌇",
          style: toasterStyle,
        });
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
      toast.success("File downloaded!", {
        icon: "📁",
        style: toasterStyle,
      });
    });
  }

  // Toast the user when a document is copied
  const successfulCopy = () => toast.success("Download link copied!", {
    icon: "✅",
    style: toasterStyle,
  });

  const deleteFile = (fileRef: StorageReference) => {
    if (!confirm("Are you sure you want to delete this file?")) return;
    deleteObject(fileRef).then(() => {
      // Update local state of the files
      setUploadedFiles((currentFiles) => currentFiles.filter((file) => file.reference !== fileRef));
      toast.success("File deleted!", {
        icon: "✅",
        style: toasterStyle,
      });
    }).catch((error) => {
      console.log(error);
      toast.error("Error deleting file!", {
        icon: "❌",
        style: toasterStyle,
      });
    });
  };

  interface FileActionProps {
    file: FileInfo;
  }

  const FileActions = ({file}: FileActionProps) => {
    return (
      <div className="
        flex flex-col justify-start items-center gap-y-1 rounded-lg w-full
        p-3 bg-zinc-200 dark:bg-slate-600 font-heading tracking-wider break-all
      ">
        {/* File name as header */}
        <div className="text-lg font-semibold">{file.name}</div>
        {/* Action Buttons */}
        <div className="flex flex-row w-full p-1 gap-x-2 justify-between">
          {/* Share, copies to clipboard on click */}
          <CopyToClipboard text={file.downloadUrl} onCopy={successfulCopy}>
            <Button className="
              h-9 px-2 py-4 rounded-xl flex flex-row grow
              bg-green-500 hover:bg-green-400"
            variant="contained">
              <span className="text-md hidden sm:block">Share</span>
              <IosShareRoundedIcon fontSize="medium" className="block sm:hidden"/>
            </Button>
          </CopyToClipboard>
          {/* Directly download the file to the user's computer */}
          <Button className="
            h-9 px-2 py-4 rounded-xl flex flex-row grow
            bg-slate-700 dark:bg-slate-50 hover:bg-slate-800 dark:hover:bg-slate-200"
          variant="contained"
          onClick={() => downloadFile(file.reference, file.name)}>
            <span className="text-md text-white dark:text-black hidden sm:block">Download</span>
            <DownloadRoundedIcon
              fontSize="medium"
              className="block sm:hidden text-white dark:text-black"/>
          </Button>
          <Button className="
            h-9 px-2 py-4 rounded-xl flex flex-row grow
          bg-red-600 hover:bg-red-500"
          variant="contained"
          onClick={() => deleteFile(file.reference)}>
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
        flex flex-col justify-start items-stretch gap-y-2 md:gap-y-4 md:grow-0 md:max-h-custom
        w-full md:w-9/20 p-2 md:p-4 drop-shadow-xl"
      >
        <div className="font-serif text-center text-2xl md:text-3xl font-bold">Uploaded Files</div>
        <div className="
          flex flex-col grow min-h-48 gap-y-2 files-container
          border-2 border-zinc-300 rounded-lg p-3 overflow-y-scroll
        ">
          { (user && !user.isAnonymous) ?
            <>
              { retrievingFiles &&
                <div className="h-full w-full grid place-items-center">
                  <BallTriangle
                    height="100"
                    width="100"
                    ariaLabel="Loading Files"
                    color={theme === "dark" ? "white" : "black"}
                  />
                </div>
              }
              { uploadedFiles.map((file, index) => (
                <FileActions file={file} key={index} />
              ))}
            </> :
            <div className="
              relative w-full h-full grid place-items-center p-8 lg:p-16
              font-mono text-3xl text-center
            ">
              Sign in with Google to save your uploaded files!
            </div>
          }

        </div>
        {user ? <SignOutButton /> : <GoogleSignInButton />}
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
        checkBeforeUploadFile={checkBeforeUploadFile}
        uploadingFile={uploadingFile}
        theme={theme}
        uploadFileProgress={uploadFileProgress}
      />
      <FileListSection />
      <UploadedDialog />
    </main>
  );
}
