import { useState } from 'react';
import { 
  Dialog, 
  DialogTrigger, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from '@/components/ui/dialog';
import { Input } from "@/components/ui/input";
import { Button } from '@/components/ui/button';
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"



const Projects = () => {
  return (
    
    <div className="flex flex-col h-full w-full p-6">
                    
      <div className="h-[35%] p-4">
        <div>Welcome to the Projects Page!</div>
      </div>
      
      <Separator className="my-4" />
      
      <div className="h-[65%] p-4">
        <div>Additional Content or Project List</div>
      </div>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" className="fixed bottom-6 right-6">
            +
          </Button>
        </DialogTrigger>
        
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add a Project</DialogTitle>
            <DialogDescription>
              Pick your project name, path and type. <br />
              Click deploy when you're done.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            {/* Project Name Field */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="projectName" className="text-right">
                Project Name
              </Label>
              <Input id="projectName" placeholder="Untitled" className="col-span-3" />
            </div>
            
            {/* Project Path Field */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="path" className="text-right">
                Project Path
              </Label>
              <Input id="path" placeholder="Your path" className="col-span-3" />
              <Button>Browse...</Button>
            </div>
            
            {/* Project Type Selector */}
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="framework" className="text-right">
                    Project Type
                </Label>
              
                <Select>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select your type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                        <SelectLabel>Select a type</SelectLabel>
                        <SelectItem value="Angular"><i className="devicon-angularjs-plain colored"></i>Angular</SelectItem>
                        <SelectItem value="React"> <i className="devicon-react-original colored"></i>React</SelectItem>
                        <SelectItem value="Vue"><i className="devicon-vuejs-plain colored"></i>Vue</SelectItem>
                        <SelectItem value="Symfony"> <i className="devicon-symfony-original"></i>Symfony</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>  
            </div>
          </div>
          
          <DialogFooter>
            <Button type="submit">Deploy 🚀</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Projects;