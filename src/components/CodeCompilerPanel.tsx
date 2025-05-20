import React, { useState, useRef, useEffect } from 'react';
import { 
  PlayCircle, 
  UploadCloud, 
  AlertCircle, 
  Check, 
  Code2, 
  Save, 
  Download, 
  Clock, 
  Layers, 
  FileSymlink,
  ChevronDown,
  FolderOpen,
  Settings,
  Bookmark,
  RotateCcw,
  Lock
} from 'lucide-react';
import Editor, { Monaco, OnMount } from '@monaco-editor/react';
import { editor } from 'monaco-editor';
import { cn } from '../lib/utils';
import './scrollbar.css';

// Pine Script language definition for Monaco
const definePineScriptLanguage = (monaco: Monaco) => {
  // Register a new language
  monaco.languages.register({ id: 'pinescript' });

  // Register a tokens provider for the language
  monaco.languages.setMonarchTokensProvider('pinescript', {
    tokenizer: {
      root: [
        [/\/\/.*$/, 'comment'],
        [/\/\*/, 'comment', '@comment'],
        [/@\w+/, 'annotation'],
        [/\b(indicator|strategy|study|plot|plotshape|plotcandle|barcolor|if|else|for|to|by|while|var|const|bool|int|float|string|color|true|false|na|series|input)\b/, 'keyword'],
        [/\b(open|high|low|close|volume|time|hl2|hlc3|ohlc4|strategy\.(entry|exit|close|cancel|risk|position_size))\b/, 'function'],
        [/".*?"/, 'string'],
        [/'.*?'/, 'string'],
        [/\b\d+(\.\d+)?\b/, 'number'],
        [/[{}()\[\]]/, '@brackets'],
        [/[<>=+\-*\/%|&]/, 'operator'],
      ],
      comment: [
        [/[^/*]+/, 'comment'],
        [/\*\//, 'comment', '@pop'],
        [/[/*]/, 'comment']
      ]
    }
  });

  // Define a theme for the language
  monaco.editor.defineTheme('pine-dark', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'comment', foreground: '6A9955' },
      { token: 'keyword', foreground: 'C586C0' },
      { token: 'function', foreground: 'DCDCAA' },
      { token: 'string', foreground: 'CE9178' },
      { token: 'number', foreground: 'B5CEA8' },
      { token: 'operator', foreground: 'D4D4D4' },
      { token: 'annotation', foreground: '569CD6' }
    ],
    colors: {
      'editor.background': '#000000',
      'editor.foreground': '#D4D4D4',
      'editor.lineHighlightBackground': '#101010',
      'editorLineNumber.foreground': '#555555',
      'editorLineNumber.activeForeground': '#CCCCCC',
      'editor.selectionBackground': '#264F78',
      'editor.inactiveSelectionBackground': '#3A3D41',
      'editorIndentGuide.background': '#252525'
    }
  });
};

interface CompilationResult {
  success: boolean;
  message: string;
  timestamp: Date;
  details?: string;
}

const CodeCompilerPanel: React.FC = () => {
  const [scriptName, setScriptName] = useState<string>("Untitled Script");
  const [code, setCode] = useState<string>(`// @version=5
indicator("My Script", overlay=true)

// This is a simple Pine Script example
// It plots a moving average on the chart

length = input.int(14, "Length", minval=1)
src = input(close, "Source")

ma = ta.sma(src, length)
plot(ma, "MA", color=color.white, linewidth=2)
`);
  const [isCompiling, setIsCompiling] = useState<boolean>(false);
  const [lastCompiled, setLastCompiled] = useState<Date | null>(null);
  const [compilationResult, setCompilationResult] = useState<CompilationResult | null>(null);
  const [showTerminal, setShowTerminal] = useState<boolean>(true);
  const [isSaved, setIsSaved] = useState<boolean>(true);
  const [editorInstance, setEditorInstance] = useState<editor.IStandaloneCodeEditor | null>(null);
  const [monacoInstance, setMonacoInstance] = useState<Monaco | null>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  // Auto-save timer
  useEffect(() => {
    if (!isSaved) {
      const timer = setTimeout(() => {
        saveScript();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [code, isSaved]);

  // Handle editor mount
  const handleEditorDidMount: OnMount = (editor, monaco) => {
    setEditorInstance(editor);
    setMonacoInstance(monaco);
    
    // Configure editor
    editor.updateOptions({
      fontSize: 14,
      fontFamily: '"JetBrains Mono", "Fira Code", "Source Code Pro", monospace',
      fontLigatures: true,
      bracketPairColorization: { enabled: true },
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      folding: true,
      foldingHighlight: true,
      matchBrackets: "always",
      guides: { indentation: true },
      renderLineHighlight: "all",
      smoothScrolling: true,
      cursorBlinking: "smooth",
      cursorSmoothCaretAnimation: "on",
      padding: { top: 10 }
    });
    
    // Configure keyboard shortcuts
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, saveScript);
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, compileScript);
    
    // Define Pine Script language
    definePineScriptLanguage(monaco);
    
    // Set language to Pine Script
    monaco.editor.setModelLanguage(editor.getModel()!, 'pinescript');
    
    // Set theme
    monaco.editor.setTheme('pine-dark');
    
    // Add change listener
    editor.onDidChangeModelContent(() => {
      setIsSaved(false);
    });
    
    // Focus editor
    editor.focus();
  };

  // Simulate script compilation
  const compileScript = async () => {
    if (isCompiling) return;
    
    setIsCompiling(true);
    setShowTerminal(true);
    
    // Simulate compilation process
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Example validation - check for some common errors
    const hasError = code.includes('error') || Math.random() < 0.1; // Randomly fail sometimes for demo
    
    const now = new Date();
    setLastCompiled(now);
    
    if (hasError) {
      setCompilationResult({
        success: false,
        message: "Compilation failed with errors",
        timestamp: now,
        details: "Line 7: Invalid function call 'sma'. Did you mean 'ta.sma'?"
      });
    } else {
      setCompilationResult({
        success: true,
        message: "Compilation successful",
        timestamp: now,
        details: "Strategy successfully compiled in 0.24s"
      });
    }
    
    setIsCompiling(false);
    
    // Scroll terminal to bottom
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  };

  // Save script
  const saveScript = () => {
    // Simulate saving
    setIsSaved(true);
    // We would actually save to a backend here
  };

  // Format code
  const formatCode = () => {
    if (editorInstance) {
      editorInstance.getAction('editor.action.formatDocument')?.run();
    }
  };

  // Publish strategy
  const publishStrategy = () => {
    if (!compilationResult?.success) {
      alert("Please compile your strategy successfully before publishing");
      return;
    }
    
    // Here we would implement the publishing logic
    alert(`Strategy "${scriptName}" published successfully!`);
  };

  return (
    <div className="flex flex-col h-full bg-black text-white border border-gray-800 rounded-md overflow-hidden">
      {/* Top Action Bar */}
      <div className="flex items-center justify-between p-2 border-b border-gray-800 bg-[#0a0a0a] flex-shrink-0">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 px-2">
            <Code2 size={16} className="text-gray-400" />
            <input 
              type="text"
              value={scriptName}
              onChange={(e) => {
                setScriptName(e.target.value);
                setIsSaved(false);
              }}
              className="px-2 py-1.5 text-sm bg-black text-white border border-gray-800 rounded-md focus:ring-1 focus:ring-gray-700 focus:border-gray-700 outline-none w-48"
            />
          </div>
          
          <button 
            onClick={compileScript}
            disabled={isCompiling}
            className={cn(
              "flex items-center space-x-2 px-3 py-1.5 text-sm bg-black hover:bg-gray-900 text-white border border-gray-800 rounded-md font-medium transition-all",
              isCompiling ? "opacity-70 cursor-not-allowed" : "hover:border-gray-700"
            )}
          >
            {isCompiling ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                <span>Compiling...</span>
              </>
            ) : (
              <>
                <PlayCircle size={16} />
                <span>Compile</span>
              </>
            )}
          </button>
          
          <div className="flex items-center text-xs text-gray-500">
            {lastCompiled && (
              <div className="flex items-center">
                <Clock size={12} className="mr-1" />
                <span>Last compiled: {lastCompiled.toLocaleTimeString()}</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="text-xs text-gray-500 flex items-center">
            {isSaved ? (
              <div className="flex items-center text-gray-400">
                <Check size={12} className="mr-1" />
                <span>Saved</span>
              </div>
            ) : (
              <div className="flex items-center text-gray-400">
                <div className="h-2 w-2 bg-gray-400 rounded-full mr-1 animate-pulse" />
                <span>Unsaved changes</span>
              </div>
            )}
          </div>
          
          <button 
            onClick={formatCode}
            className="flex items-center space-x-1 px-2 py-1.5 text-xs bg-black hover:bg-gray-900 text-gray-400 hover:text-white border border-gray-800 rounded-md transition-all"
          >
            <Layers size={14} />
            <span>Format</span>
          </button>
          
          <button 
            onClick={publishStrategy}
            className="flex items-center space-x-2 px-3 py-1.5 text-sm bg-black hover:bg-gray-900 text-white border border-gray-800 rounded-md font-medium transition-all hover:border-gray-700"
          >
            <UploadCloud size={16} />
            <span>Publish Strategy</span>
          </button>
        </div>
      </div>

      {/* Editor Tabs */}
      <div className="flex items-center border-b border-gray-800 bg-[#0a0a0a] text-xs px-2">
        <div className="flex items-center px-3 py-2 border-b-2 border-white text-white font-medium">
          <FileSymlink size={14} className="mr-2" />
          <span>{scriptName}</span>
        </div>
        <div className="flex items-center px-3 py-2 text-gray-500 hover:text-gray-300 cursor-pointer transition-colors">
          <Bookmark size={14} className="mr-2" />
          <span>Saved Versions</span>
        </div>
        <div className="flex items-center px-3 py-2 text-gray-500 hover:text-gray-300 cursor-pointer transition-colors">
          <RotateCcw size={14} className="mr-2" />
          <span>History</span>
        </div>
      </div>

      {/* Main Editor Area with Split Layout */}
      <div className="flex-grow flex flex-col overflow-hidden">
        {/* Editor Container */}
        <div className="flex-grow relative min-h-[200px]">
          <Editor
            height="100%"
            defaultLanguage="pinescript"
            value={code}
            onChange={(value) => setCode(value || "")}
            onMount={handleEditorDidMount}
            options={{
              wordWrap: 'on',
              automaticLayout: true,
              glyphMargin: true,
              lineNumbersMinChars: 3,
              scrollBeyondLastLine: false,
              renderWhitespace: 'boundary',
              scrollbar: {
                verticalScrollbarSize: 10,
                horizontalScrollbarSize: 10,
                verticalSliderSize: 10,
                horizontalSliderSize: 10,
                verticalHasArrows: false,
                horizontalHasArrows: false,
                arrowSize: 0
              }
            }}
            className="editor-container"
          />
          
          {/* Status indicator overlay */}
          <div className="absolute bottom-3 right-3 flex items-center space-x-2 text-xs bg-[#111]/80 text-gray-300 px-2 py-1 rounded-md backdrop-blur-sm border border-gray-800">
            <div className="flex items-center">
              <span className="inline-block w-2 h-2 rounded-full mr-1.5 bg-gray-400" />
              <span>Pine Script v5</span>
            </div>
            <div className="h-3 w-px bg-gray-700" />
            <div className="flex items-center">
              {compilationResult?.success === true && (
                <>
                  <span className="inline-block w-2 h-2 rounded-full mr-1.5 bg-green-500" />
                  <span>Compiled</span>
                </>
              )}
              {compilationResult?.success === false && (
                <>
                  <span className="inline-block w-2 h-2 rounded-full mr-1.5 bg-red-500" />
                  <span>Error</span>
                </>
              )}
              {compilationResult === null && (
                <>
                  <span className="inline-block w-2 h-2 rounded-full mr-1.5 bg-gray-500" />
                  <span>Not compiled</span>
                </>
              )}
            </div>
            <div className="h-3 w-px bg-gray-700" />
            <div className="flex items-center">
              <Lock size={10} className="mr-1 text-gray-400" />
              <span>Secure</span>
            </div>
          </div>
        </div>
        
        {/* Terminal/Output Area */}
        <div className={cn(
          "border-t border-gray-800 bg-[#0a0a0a] text-sm transition-all duration-300 overflow-hidden",
          showTerminal ? "h-[180px]" : "h-0"
        )}>
          <div className="flex items-center justify-between p-2 border-b border-gray-800 bg-black text-xs">
            <div className="flex items-center space-x-3">
              <span className="font-mono font-semibold">CONSOLE</span>
              {compilationResult?.success === true && (
                <span className="flex items-center text-green-500">
                  <Check size={12} className="mr-1" />
                  Success
                </span>
              )}
              {compilationResult?.success === false && (
                <span className="flex items-center text-red-500">
                  <AlertCircle size={12} className="mr-1" />
                  Error
                </span>
              )}
            </div>
            <button 
              onClick={() => setShowTerminal(!showTerminal)}
              className="hover:text-white text-gray-500 transition-colors"
            >
              <ChevronDown size={16} className={cn(
                "transition-transform",
                !showTerminal && "rotate-180"
              )} />
            </button>
          </div>
          
          <div 
            ref={terminalRef}
            className="font-mono p-3 overflow-auto h-[calc(100%-32px)] text-xs"
          >
            {/* Terminal content */}
            <div className="text-gray-400">
              <div className="mb-2">[{new Date().toLocaleTimeString()}] Pine Script compiler initialized</div>
              {compilationResult && (
                <>
                  <div className={cn(
                    "mb-1 font-semibold",
                    compilationResult.success ? "text-green-500" : "text-red-500"
                  )}>
                    [{compilationResult.timestamp.toLocaleTimeString()}] {compilationResult.message}
                  </div>
                  {compilationResult.details && (
                    <div className="ml-4 mb-2">{compilationResult.details}</div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Keyboard shortcuts tooltip - could be expanded */}
      <div className="hidden absolute bottom-4 left-4 text-xs bg-[#111]/90 text-gray-300 px-3 py-2 rounded-md backdrop-blur-sm border border-gray-800">
        <div className="font-medium mb-1">Keyboard Shortcuts</div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
          <div className="flex justify-between">
            <span>Compile</span>
            <span className="font-mono">Ctrl+Enter</span>
          </div>
          <div className="flex justify-between">
            <span>Save</span>
            <span className="font-mono">Ctrl+S</span>
          </div>
          <div className="flex justify-between">
            <span>Format</span>
            <span className="font-mono">Shift+Alt+F</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeCompilerPanel;