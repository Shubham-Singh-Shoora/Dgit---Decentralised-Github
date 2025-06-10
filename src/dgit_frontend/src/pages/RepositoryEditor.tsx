import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { GitBranch, Folder, File, ChevronRight, ChevronDown } from 'lucide-react';
import Editor from '@monaco-editor/react';
import { useToast } from '@/hooks/use-toast';

// Mock file tree data
const mockFileTree: FileNode[] = [
  {
    name: 'src',
    type: 'folder' as const,
    children: [
      { name: 'main.js', type: 'file' as const, content: '// Main application file\nconsole.log("Hello, dGit!");' },
      { name: 'utils.js', type: 'file' as const, content: '// Utility functions\nexport const helper = () => {\n  return "Helper function";\n};' },
      {
        name: 'components',
        type: 'folder' as const,
        children: [
          { name: 'App.js', type: 'file' as const, content: '// App component\nimport React from "react";\n\nconst App = () => {\n  return <div>Hello World</div>;\n};\n\nexport default App;' }
        ]
      }
    ]
  },
  { name: 'README.md', type: 'file' as const, content: '# My Awesome Project\n\nThis is a sample repository for dGit.' },
  { name: 'package.json', type: 'file' as const, content: '{\n  "name": "my-project",\n  "version": "1.0.0",\n  "main": "src/main.js"\n}' }
];

const branches = ['main', 'develop', 'feature/new-ui'];

interface FileNode {
  name: string;
  type: 'file' | 'folder';
  content?: string;
  children?: FileNode[];
}

const RepositoryEditor = () => {
  const { repoId, branch } = useParams();
  const [selectedFile, setSelectedFile] = useState<FileNode | null>(null);
  const [fileContent, setFileContent] = useState('');
  const [commitMessage, setCommitMessage] = useState('');
  const [currentBranch, setCurrentBranch] = useState(branch || 'main');
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['src']));
  const { toast } = useToast();

  useEffect(() => {
    // Select README.md by default
    const readmeFile = mockFileTree.find(item => item.name === 'README.md');
    if (readmeFile) {
      setSelectedFile(readmeFile);
      setFileContent(readmeFile.content || '');
    }
  }, []);

  const toggleFolder = (folderName: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderName)) {
      newExpanded.delete(folderName);
    } else {
      newExpanded.add(folderName);
    }
    setExpandedFolders(newExpanded);
  };

  const selectFile = (file: FileNode) => {
    if (file.type === 'file') {
      setSelectedFile(file);
      setFileContent(file.content || '');
    }
  };

  const renderFileTree = (nodes: FileNode[], level = 0) => {
    return nodes.map((node, index) => (
      <div key={`${level}-${index}`}>
        <div
          className={`flex items-center gap-2 py-1 px-2 hover:bg-accent cursor-pointer rounded-sm ${
            selectedFile?.name === node.name ? 'bg-accent' : ''
          }`}
          style={{ paddingLeft: `${level * 16 + 8}px` }}
          onClick={() => node.type === 'folder' ? toggleFolder(node.name) : selectFile(node)}
        >
          {node.type === 'folder' ? (
            <>
              {expandedFolders.has(node.name) ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
              <Folder className="h-4 w-4 text-primary" />
            </>
          ) : (
            <File className="h-4 w-4 text-muted-foreground ml-6" />
          )}
          <span className="text-sm">{node.name}</span>
        </div>
        {node.type === 'folder' && expandedFolders.has(node.name) && node.children && (
          <div>
            {renderFileTree(node.children, level + 1)}
          </div>
        )}
      </div>
    ));
  };

  const handleCommit = () => {
    if (!commitMessage.trim()) {
      toast({
        title: "Error",
        description: "Commit message is required",
        variant: "destructive"
      });
      return;
    }

    // Simulate commit
    toast({
      title: "Success",
      description: `Changes committed to ${currentBranch}`
    });
    setCommitMessage('');
  };

  const getFileLanguage = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'js':
      case 'jsx':
        return 'javascript';
      case 'ts':
      case 'tsx':
        return 'typescript';
      case 'md':
        return 'markdown';
      case 'json':
        return 'json';
      case 'css':
        return 'css';
      case 'html':
        return 'html';
      default:
        return 'plaintext';
    }
  };

  return (
    <div className="h-screen bg-background flex flex-col">
      {/* Top Info Bar */}
      <div className="border-b bg-card p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <GitBranch className="h-5 w-5 text-primary" />
              <Link to="/dashboard" className="text-lg font-bold text-foreground hover:text-primary">
                dGit
              </Link>
              <span className="text-muted-foreground">/</span>
              <span className="text-lg font-semibold">{repoId}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Branch:</span>
              <Select value={currentBranch} onValueChange={setCurrentBranch}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {branches.map((branchName) => (
                    <SelectItem key={branchName} value={branchName}>
                      {branchName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Link to="/dashboard" className="text-sm text-muted-foreground hover:text-foreground">
            Back to Dashboard
          </Link>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-64 border-r bg-card flex flex-col">
          <div className="p-4 border-b">
            <h3 className="font-semibold text-sm">Files</h3>
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            {renderFileTree(mockFileTree)}
          </div>
        </div>

        {/* Main Editor Area */}
        <div className="flex-1 flex flex-col">
          {selectedFile ? (
            <>
              {/* File Header */}
              <div className="border-b p-3 bg-card">
                <div className="flex items-center gap-2">
                  <File className="h-4 w-4" />
                  <span className="font-medium">{selectedFile.name}</span>
                </div>
              </div>

              {/* Editor */}
              <div className="flex-1">
                <Editor
                  height="100%"
                  language={getFileLanguage(selectedFile.name)}
                  value={fileContent}
                  onChange={(value) => setFileContent(value || '')}
                  theme="vs-dark"
                  options={{
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    fontSize: 14,
                    lineNumbers: 'on',
                    renderWhitespace: 'selection',
                    selectOnLineNumbers: true,
                    automaticLayout: true,
                  }}
                />
              </div>

              {/* Commit Section */}
              <div className="border-t p-4 bg-card">
                <div className="space-y-3">
                  <Textarea
                    placeholder="Commit message"
                    value={commitMessage}
                    onChange={(e) => setCommitMessage(e.target.value)}
                    rows={2}
                  />
                  <Button onClick={handleCommit} className="w-full">
                    Commit Changes
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              Select a file to start editing
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RepositoryEditor;