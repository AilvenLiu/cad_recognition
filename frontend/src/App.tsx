import React, { useState, createContext } from 'react';
import { Route, Routes, Link } from 'react-router-dom';
import { FaHome, FaFile, FaFileExport, FaCubes, FaFileCode, FaMagic, FaCog, FaQuestionCircle, FaBell } from "react-icons/fa";
import { AppState, Settings } from "./types";
import { usePersistedState } from "./hooks/usePersistedState";
import { Stack } from "./lib/stacks";
import { CodeGenerationModel } from "./lib/models";
import { EditorTheme } from "./types";
import MainInterface from './components/MainInterface';
import FileManagement from './components/FileManagement';
import ExportManagement from './components/ExportManagement';
import ModelManagement from './components/ModelManagement';
import FormatManagement from './components/FormatManagement';
import IntelligentOptimization from './components/IntelligentOptimization';
import SettingsDialog from './components/SettingsDialog';

export interface AppContextType {
  appState: AppState;
  setAppState: React.Dispatch<React.SetStateAction<AppState>>;
  generatedCode: string;
  setGeneratedCode: React.Dispatch<React.SetStateAction<string>>;
  inputMode: "image" | "pdf";
  referenceImages: string[];
  settings: Settings;
  doUpdate: () => void;
  regenerate: () => void;
  downloadCode: () => void;
  doCreate: (images: string[], mode: "image" | "pdf") => void;
  updateInstruction: string;
  setUpdateInstruction: React.Dispatch<React.SetStateAction<string>>;
  shouldIncludeResultImage: boolean;
  setShouldIncludeResultImage: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

function App() {
  const [appState, setAppState] = useState<AppState>(AppState.INITIAL);
  const [generatedCode, setGeneratedCode] = useState<string>("");
  const [inputMode, setInputMode] = useState<"image" | "pdf">("image");
  const [referenceImages, setReferenceImages] = useState<string[]>([]);
  const [updateInstruction, setUpdateInstruction] = useState("");
  const [shouldIncludeResultImage, setShouldIncludeResultImage] = useState(false);
  
  const [settings, setSettings] = usePersistedState<Settings>(
    {
      openAiApiKey: null,
      openAiBaseURL: null,
      screenshotOneApiKey: null,
      isImageGenerationEnabled: true,
      editorTheme: EditorTheme.COBALT,
      generatedCodeConfig: Stack.JPG,
      codeGenerationModel: CodeGenerationModel.GPT_4O_2024_05_13,
      isTermOfServiceAccepted: false,
    },
    "setting"
  );

  const doCreate = (images: string[], mode: "image" | "pdf") => {
    setReferenceImages(images);
    setInputMode(mode);
    setAppState(AppState.CODING);
    // Implement the actual code generation logic here
  };

  const doUpdate = () => {
    // Implement the update logic here
  };

  const regenerate = () => {
    doCreate(referenceImages, inputMode);
  };

  const downloadCode = () => {
    // Implement the download logic here
  };

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const notifications = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const handleLogin = () => {
    // Implement login logic here
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    // Implement logout logic here
    setIsLoggedIn(false);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Implement search logic here
  };

  const handleNotificationClick = () => {
    // Implement notification handling logic here
  };

  return (
    <AppContext.Provider value={{
      appState, setAppState, generatedCode, setGeneratedCode, inputMode, referenceImages,
      settings, doUpdate, regenerate, downloadCode, doCreate,
      updateInstruction, setUpdateInstruction,
      shouldIncludeResultImage, setShouldIncludeResultImage
    }}>
      <div className="min-h-screen bg-gray-100 text-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white shadow-md mb-8">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
              <h1 className="text-2xl font-bold text-blue-600">油气管道审图小助手</h1>
              <div className="flex items-center space-x-4">
                <input
                  type="text"
                  placeholder="搜索..."
                  className="px-3 py-2 border rounded-md"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                />
                <nav>
                  <ul className="flex space-x-4">
                    <li><Link to="/" className="text-gray-600 hover:text-blue-600">主页</Link></li>
                    <li><Link to="/file-management" className="text-gray-600 hover:text-blue-600">文件管理</Link></li>
                    <li><Link to="/export-management" className="text-gray-600 hover:text-blue-600">导出管理</Link></li>
                    <li><Link to="/model-management" className="text-gray-600 hover:text-blue-600">模型管理</Link></li>
                    <li><Link to="/format-management" className="text-gray-600 hover:text-blue-600">格式管理</Link></li>
                    <li><Link to="/intelligent-optimization" className="text-gray-600 hover:text-blue-600">智能优化</Link></li>
                  </ul>
                </nav>
                <button onClick={handleNotificationClick} className="text-gray-600 hover:text-blue-600">
                  <FaBell />
                  {notifications.length > 0 && (
                    <span className="bg-red-500 text-white rounded-full px-2 py-1 text-xs absolute -mt-2 -mr-2">
                      {notifications.length}
                    </span>
                  )}
                </button>
                {isLoggedIn ? (
                  <button onClick={handleLogout} className="text-gray-600 hover:text-blue-600">登出</button>
                ) : (
                  <button onClick={handleLogin} className="text-gray-600 hover:text-blue-600">登录</button>
                )}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg p-6 shadow-lg">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">控制中心</h2>
                <nav className="space-y-2">
                  <Link to="/" className="w-full justify-start flex items-center p-2 rounded hover:bg-gray-100">
                    <FaHome className="mr-2" /> 主页
                  </Link>
                  <Link to="/file-management" className="w-full justify-start flex items-center p-2 rounded hover:bg-gray-100">
                    <FaFile className="mr-2" /> 文件管理
                  </Link>
                  <Link to="/export-management" className="w-full justify-start flex items-center p-2 rounded hover:bg-gray-100">
                    <FaFileExport className="mr-2" /> 导出管理
                  </Link>
                  <Link to="/model-management" className="w-full justify-start flex items-center p-2 rounded hover:bg-gray-100">
                    <FaCubes className="mr-2" /> 模型管理
                  </Link>
                  <Link to="/format-management" className="w-full justify-start flex items-center p-2 rounded hover:bg-gray-100">
                    <FaFileCode className="mr-2" /> 格式管理
                  </Link>
                  <Link to="/intelligent-optimization" className="w-full justify-start flex items-center p-2 rounded hover:bg-gray-100">
                    <FaMagic className="mr-2" /> 智能优化
                  </Link>
                  <button className="w-full justify-start flex items-center p-2 rounded hover:bg-gray-100">
                    <FaCog className="mr-2" /> 设置
                  </button>
                  <button className="w-full justify-start flex items-center p-2 rounded hover:bg-gray-100">
                    <FaQuestionCircle className="mr-2" /> 帮助
                  </button>
                </nav>
              </div>
            </div>
            <div className="lg:col-span-3">
              <Routes>
                <Route path="/" element={<MainInterface />} />
                <Route path="/file-management" element={<FileManagement />} />
                <Route path="/export-management" element={<ExportManagement />} />
                <Route path="/model-management" element={<ModelManagement />} />
                <Route path="/format-management" element={<FormatManagement />} />
                <Route path="/intelligent-optimization" element={<IntelligentOptimization />} />
              </Routes>
            </div>
          </div>
          <SettingsDialog settings={settings} setSettings={setSettings} />
        </div>
      </div>
    </AppContext.Provider>
  );

}

export default App;