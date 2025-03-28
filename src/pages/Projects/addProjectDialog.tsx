import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { open } from "@tauri-apps/plugin-dialog";
import { writeTextFile, readTextFile, BaseDirectory, mkdir } from "@tauri-apps/plugin-fs";

// UI Components
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"; // Import Alert components
import { Terminal } from "lucide-react"; // If you need an icon in the alert

// Component for adding a new project
export function AddProjectDialog({ onAddProject }: { onAddProject: (project: any) => void }) {
  // State variables to handle user input and alert visibility
  const [projectName, setProjectName] = useState(""); // Project name input
  const [projectPath, setProjectPath] = useState(""); // Project path input
  const [projectType, setProjectType] = useState(""); // Project type input (e.g., Angular, React)
  const [isSuccess, setIsSuccess] = useState(false); // Flag to track success alert
  const [isError, setIsError] = useState(false); // Flag to track error alert
  const [fadeOut, setFadeOut] = useState(false); // Flag to handle fade-out of alert

  // Effect to handle the fade-out of the alert after 3 seconds
  useEffect(() => {
    if (isSuccess || isError) {
      const timer = setTimeout(() => {
        setFadeOut(true); // Start fading out after 3 seconds
      }, 3000); // 3 seconds delay

      // Cleanup the timer if the component unmounts or if alert state changes
      return () => clearTimeout(timer);
    }
  }, [isSuccess, isError]);

  // Function to handle form submission (creating a project)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Ensure all fields are filled
    if (!projectName || !projectPath || !projectType) {
      alert("Please fill in all fields.");
      return;
    }

    console.log("Creating project:", { projectName, projectPath, projectType });

    try {
      // Call the Tauri command to create a project (optional)
      const result = await invoke("create_project", {
        name: projectName,
        path: projectPath,
        template: projectType,
      });
      console.log("Tauri response:", result);

      // Create a new project object
      const newProject = { name: projectName, path: projectPath, type: projectType };

      // Save the project to a local file
      await saveProject(newProject);

      // Update the parent component with the new project
      onAddProject(newProject);

      // Show success alert and reset fade-out state
      setIsSuccess(true);
      setFadeOut(false);

      // Clear input fields
      setProjectName("");
      setProjectPath("");
      setProjectType("");
    } catch (error) {
      console.error("Error creating project:", error);
      setIsError(true); // Trigger error state
      setIsSuccess(false); // Hide success if there's an error
      alert(`Error: ${error}`);
    }
  };

  // Function to handle folder browsing for project path
  const handleBrowse = async () => {
    try {
      const selectedFolder = await open({ directory: true });
      if (selectedFolder) {
        setProjectPath(selectedFolder as string); // Set selected folder as the project path
      }
    } catch (error) {
      alert("Failed to open folder dialog: " + error);
    }
  };

  // Function to save the project to a file
  const saveProject = async (project: any) => {
    try {
      let projects: any[] = [];
      const filePath = 'projects/projects.json';

      // Ensure the directory exists (create if needed)
      try {
        await mkdir('projects', { 
          baseDir: BaseDirectory.AppData, 
          recursive: true 
        });
      } catch (dirError) {
        console.log("Directory already exists or couldn't be created:", dirError);
      }

      // Read existing projects from the file (if any)
      try {
        const data = await readTextFile(filePath, { baseDir: BaseDirectory.AppData });
        projects = JSON.parse(data); // Parse existing data into an array
      } catch (readError) {
        console.log("No existing projects file found, will create new one");
      }

      // Add the new project to the projects list
      projects.push(project);

      // Write updated projects list back to the file
      await writeTextFile(
        filePath,
        JSON.stringify(projects, null, 2),
        { 
          baseDir: BaseDirectory.AppData,
          create: true 
        }
      );
    } catch (error) {
      console.error("Failed to save project:", error);
      throw error; // Re-throw error if saving fails
    }
  };

  return (
    <Dialog>
      {/* Trigger to open the dialog */}
      <DialogTrigger asChild>
        <Button variant="outline" className="fixed bottom-6 right-6">+</Button>
      </DialogTrigger>

      {/* Dialog content for adding a project */}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add a Project</DialogTitle>
          <DialogDescription>Enter details and deploy your project.</DialogDescription>
        </DialogHeader>

        {/* Form inputs */}
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="projectName" className="text-right">Project Name</Label>
            <Input 
              id="projectName" 
              value={projectName} 
              onChange={(e) => setProjectName(e.target.value)} 
              className="col-span-3" 
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="path" className="text-right">Project Path</Label>
            <Input 
              id="path" 
              value={projectPath} 
              onChange={(e) => setProjectPath(e.target.value)} 
              className="col-span-3" 
            />
            <Button onClick={handleBrowse}>Browse...</Button>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="framework" className="text-right">Project Type</Label>
            <Select onValueChange={setProjectType} value={projectType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select your type" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Select a type</SelectLabel>
                  <SelectItem value="Angular">Angular</SelectItem>
                  <SelectItem value="React">React</SelectItem>
                  <SelectItem value="Vue">Vue</SelectItem>
                  <SelectItem value="Symfony">Symfony</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Dialog footer with the submit button */}
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit}>Deploy 🚀</Button>
        </DialogFooter>
      </DialogContent>

      {/* Alert for success or error */}
      {(isSuccess || isError) && (
        <div
          className={`fixed bottom-6 right-6 p-4 rounded-md w-72 transition-opacity duration-1000 ease-in-out ${fadeOut ? "opacity-0" : "opacity-100"}`}
        >
          <Alert>
            <Terminal className="h-4 w-4" />
            <AlertTitle>{isSuccess ? "Project Created!" : "Error"}</AlertTitle>
            <AlertDescription>
              {isSuccess
                ? "Your project was created successfully."
                : "There was an error creating your project."}
            </AlertDescription>
          </Alert>
        </div>
      )}
    </Dialog>
  );
}

export default AddProjectDialog;
