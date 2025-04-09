
import React, { useState, useEffect } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import { StickyNote, Plus, X, Edit, Save, Trash2, Download, Copy, CalendarDays } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { format } from "date-fns";

interface Note {
  id: string;
  title: string;
  content: string;
  color: string;
  createdAt: string;
  updatedAt: string;
}

const QuickNotes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeNote, setActiveNote] = useState<Note | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('updatedAt');
  
  // Load notes from local storage on initial render
  useEffect(() => {
    const savedNotes = localStorage.getItem('quickNotes');
    if (savedNotes) {
      try {
        const parsedNotes = JSON.parse(savedNotes);
        setNotes(parsedNotes);
      } catch (error) {
        console.error('Failed to parse saved notes:', error);
      }
    }
  }, []);
  
  // Save notes to local storage whenever notes change
  useEffect(() => {
    localStorage.setItem('quickNotes', JSON.stringify(notes));
  }, [notes]);
  
  const createNewNote = () => {
    const now = new Date().toISOString();
    const newNote: Note = {
      id: `note-${Date.now()}`,
      title: 'Untitled Note',
      content: '',
      color: getRandomColor(),
      createdAt: now,
      updatedAt: now,
    };
    
    setNotes([...notes, newNote]);
    setActiveNote(newNote);
    setIsEditing(true);
  };
  
  const updateNote = (updatedNote: Note) => {
    const now = new Date().toISOString();
    const updated = { ...updatedNote, updatedAt: now };
    
    setNotes(notes.map(note => note.id === updated.id ? updated : note));
    setActiveNote(updated);
    setIsEditing(false);
    toast.success('Note saved!');
  };
  
  const deleteNote = (id: string) => {
    setNotes(notes.filter(note => note.id !== id));
    if (activeNote?.id === id) {
      setActiveNote(null);
      setIsEditing(false);
    }
    toast.success('Note deleted!');
  };
  
  const getRandomColor = () => {
    const colors = [
      'bg-yellow-100',
      'bg-green-100',
      'bg-blue-100',
      'bg-purple-100',
      'bg-pink-100',
      'bg-orange-100',
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };
  
  // Filter and sort notes
  const filteredNotes = notes
    .filter(note => 
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      note.content.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      } else if (sortBy === 'createdAt') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else { // updatedAt
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      }
    });
  
  const handleDownloadNote = () => {
    if (!activeNote) return;
    
    const noteContent = `# ${activeNote.title}\n\n${activeNote.content}\n\nCreated: ${format(new Date(activeNote.createdAt), 'PPpp')}\nLast updated: ${format(new Date(activeNote.updatedAt), 'PPpp')}`;
    
    const blob = new Blob([noteContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeNote.title.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Note downloaded!');
  };
  
  const copyNoteToClipboard = () => {
    if (!activeNote) return;
    
    navigator.clipboard.writeText(activeNote.content)
      .then(() => toast.success('Note copied to clipboard!'))
      .catch(() => toast.error('Failed to copy note to clipboard'));
  };
  
  return (
    <ToolLayout 
      title="Quick Notes" 
      description="Take quick notes in your browser with auto-save and organization features"
      icon={<StickyNote className="h-6 w-6" />}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Note List Sidebar */}
        <Card className="lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle>My Notes</CardTitle>
              <CardDescription>
                {notes.length} note{notes.length !== 1 ? 's' : ''}
              </CardDescription>
            </div>
            <Button size="sm" onClick={createNewNote}>
              <Plus className="h-4 w-4 mr-1" />
              New Note
            </Button>
          </CardHeader>
          <div className="px-6 py-2">
            <Input
              placeholder="Search notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mb-2"
            />
            <div className="flex items-center mb-2">
              <span className="text-sm mr-2">Sort by:</span>
              <Select
                value={sortBy}
                onValueChange={setSortBy}
              >
                <SelectTrigger className="h-8 w-[160px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="updatedAt">Last Updated</SelectItem>
                  <SelectItem value="createdAt">Created Date</SelectItem>
                  <SelectItem value="title">Title</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <CardContent className="px-6">
            {filteredNotes.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {notes.length === 0 ? 
                  "No notes yet. Create your first note!" : 
                  "No notes match your search."}
              </div>
            ) : (
              <div className="space-y-2 max-h-[500px] overflow-y-auto">
                {filteredNotes.map(note => (
                  <div
                    key={note.id}
                    className={`p-3 rounded-md cursor-pointer border ${
                      note.id === activeNote?.id ? 'border-primary' : ''
                    }`}
                    onClick={() => {
                      setActiveNote(note);
                      setIsEditing(false);
                    }}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium truncate">{note.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {note.content}
                        </p>
                      </div>
                      <div
                        className={`w-4 h-4 rounded-full ml-2 mt-1 ${note.color}`}
                      />
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      Updated {format(new Date(note.updatedAt), 'MMM d, yyyy')}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Note Editor */}
        <Card className="lg:col-span-2">
          {!activeNote ? (
            <div className="flex items-center justify-center h-[400px]">
              <div className="text-center">
                <StickyNote className="mx-auto h-12 w-12 text-muted-foreground" />
                <h2 className="mt-2 text-xl font-semibold">No Note Selected</h2>
                <p className="mt-1 text-muted-foreground">
                  Select a note from the list or create a new one
                </p>
                <Button
                  onClick={createNewNote}
                  className="mt-4"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  New Note
                </Button>
              </div>
            </div>
          ) : isEditing ? (
            <>
              <CardHeader className="pb-3">
                <Input
                  value={activeNote.title}
                  onChange={(e) => setActiveNote({ ...activeNote, title: e.target.value })}
                  className="text-xl font-semibold border-none p-0 focus-visible:ring-0"
                  placeholder="Note Title"
                />
                <CardDescription>
                  Editing note
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={activeNote.content}
                  onChange={(e) => setActiveNote({ ...activeNote, content: e.target.value })}
                  className="min-h-[300px] border-none focus-visible:ring-0 p-0"
                  placeholder="Start typing..."
                />
              </CardContent>
              <CardFooter className="border-t pt-4 flex justify-between">
                <div>
                  <Select
                    value={activeNote.color}
                    onValueChange={(color) => setActiveNote({ ...activeNote, color })}
                  >
                    <SelectTrigger className="w-[180px]">
                      <div className="flex items-center">
                        <div className={`w-4 h-4 rounded-full mr-2 ${activeNote.color}`} />
                        <span>Note Color</span>
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bg-yellow-100">Yellow</SelectItem>
                      <SelectItem value="bg-green-100">Green</SelectItem>
                      <SelectItem value="bg-blue-100">Blue</SelectItem>
                      <SelectItem value="bg-purple-100">Purple</SelectItem>
                      <SelectItem value="bg-pink-100">Pink</SelectItem>
                      <SelectItem value="bg-orange-100">Orange</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    <X className="h-4 w-4 mr-1" />
                    Cancel
                  </Button>
                  <Button onClick={() => updateNote(activeNote)}>
                    <Save className="h-4 w-4 mr-1" />
                    Save
                  </Button>
                </div>
              </CardFooter>
            </>
          ) : (
            <>
              <CardHeader className={`${activeNote.color}`}>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl">{activeNote.title}</CardTitle>
                </div>
                <CardDescription>
                  <div className="flex items-center text-muted-foreground">
                    <CalendarDays className="h-3.5 w-3.5 mr-1" />
                    Created: {format(new Date(activeNote.createdAt), 'PP')}
                    {" · "}
                    Updated: {format(new Date(activeNote.updatedAt), 'PP')}
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="whitespace-pre-wrap min-h-[300px]">
                  {activeNote.content || <span className="text-muted-foreground italic">No content</span>}
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4 flex justify-between">
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={handleDownloadNote}>
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                  <Button variant="outline" size="sm" onClick={copyNoteToClipboard}>
                    <Copy className="h-4 w-4 mr-1" />
                    Copy
                  </Button>
                </div>
                <div className="flex space-x-2">
                  <Button variant="destructive" size="sm" onClick={() => deleteNote(activeNote.id)}>
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                  <Button size="sm" onClick={() => setIsEditing(true)}>
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                </div>
              </CardFooter>
            </>
          )}
        </Card>
      </div>
    </ToolLayout>
  );
};

export default QuickNotes;
