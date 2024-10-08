import React, { useState, createContext } from 'react';
import { Route, Routes, Link } from 'react-router-dom';
import {
  FaFile,
  FaFileExport,
  FaCubes,
  FaFileCode,
  FaMagic,
  FaCog,
  FaQuestionCircle,
  FaUser,
} from "react-icons/fa";
import { ChevronDownIcon } from "@radix-ui/react-icons";
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
import AuthDialog from './components/AuthDialog';
import AccountSettings from './components/AccountSettings';
import * as Accordion from '@radix-ui/react-accordion';

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
  user: any | null;
  setUser: React.Dispatch<React.SetStateAction<any | null>>;
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
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

  const [user, setUser] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [searchQuery, setSearchQuery] = useState<string>("");

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isSettingsDialogOpen, setIsSettingsDialogOpen] = useState(false);

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

  const handleLogin = (userData: any) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    // Implement logout logic here
    setIsAuthenticated(false);
    setUserMenuOpen(false);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Implement search logic here
  };

  return (
    <AppContext.Provider value={{
      appState, setAppState, generatedCode, setGeneratedCode, inputMode, referenceImages,
      settings, doUpdate, regenerate, downloadCode, doCreate,
      updateInstruction, setUpdateInstruction,
      shouldIncludeResultImage, setShouldIncludeResultImage,
      user, setUser,
      isAuthenticated,
      setIsAuthenticated
    }}>
      <div className="min-h-screen bg-gray-100 text-gray-900">
        {/* Top Navigation Bar */}
        <div className="bg-white shadow-md mb-8">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <Link to="/" className="text-2xl font-bold text-blue-600 hover:text-blue-800">
              油气管道审图小助手
            </Link>
            <div className="flex items-center space-x-6">
              <input
                type="text"
                placeholder="搜索..."
                className="px-3 py-2 border rounded-md w-64"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
              />
              <nav className="flex space-x-6">
                <button
                  onClick={() => setSettingsOpen(!settingsOpen)}
                  className="text-gray-600 hover:text-blue-600 focus:outline-none flex items-center"
                >
                  <FaCog className="mr-2" /> 设置
                </button>
                <Link to="/help" className="text-gray-600 hover:text-blue-600 flex items-center">
                  <FaQuestionCircle className="mr-2" /> 帮助
                </Link>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="text-gray-600 hover:text-blue-600 focus:outline-none flex items-center"
                >
                  <FaUser className="mr-2" /> {user ? user.name : '账户'}
                </button>
              </nav>
            </div>
          </div>
          {settingsOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg z-50">
              <div className="py-1">
                <button onClick={() => {/* Implement file settings logic */}} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">文件设置</button>
                <div className="px-4 py-1">
                  <Link to="/file-settings/auto-compress" className="block py-1 text-sm text-gray-600 hover:text-gray-900">自动压缩文件</Link>
                  <Link to="/file-settings/disable-compress" className="block py-1 text-sm text-gray-600 hover:text-gray-900">禁止压缩文件</Link>
                  <Link to="/file-settings/auto-new-canvas" className="block py-1 text-sm text-gray-600 hover:text-gray-900">自动新建画布</Link>
                  <Link to="/file-settings/auto-create-copy" className="block py-1 text-sm text-gray-600 hover:text-gray-900">自动创建副本</Link>
                </div>
              </div>
              <div className="py-1">
                <button onClick={() => {/* Implement backup settings logic */}} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">备份设置</button>
                <div className="px-4 py-1">
                  <Link to="/backup-settings/enable-auto-backup" className="block py-1 text-sm text-gray-600 hover:text-gray-900">开启自动备份</Link>
                  <Link to="/backup-settings/local-backup-only" className="block py-1 text-sm text-gray-600 hover:text-gray-900">仅限本地备份</Link>
                  <Link to="/backup-settings/allow-cloud-backup" className="block py-1 text-sm text-gray-600 hover:text-gray-900">允许云端备份</Link>
                </div>
              </div>
              <Link to="/reset-settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">重置初始设置</Link>
              <button onClick={() => setIsSettingsDialogOpen(true)} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">高级设置</button>
            </div>
          )}
          {userMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg z-50">
              <Link to="/account-settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">账户设置</Link>
              <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">登出</button>
            </div>
          )}
        </div>
        {/* Main Content */}
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
            {/* Left Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg p-6 shadow-lg">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">快捷工具箱</h2>
                <Accordion.Root type="multiple" className="space-y-2">
                  {/* 文件管理 with sub-buttons */}
                  <Accordion.Item value="file-management">
                    <Accordion.Header>
                      <Accordion.Trigger className="w-full justify-start flex items-center p-2 rounded hover:bg-gray-100 focus:outline-none">
                        <FaFile className="mr-2" /> 文件管理
                        <ChevronDownIcon className="ml-auto transition-transform duration-200" />
                      </Accordion.Trigger>
                    </Accordion.Header>
                    <Accordion.Content className="pl-8 mt-2 space-y-1">
                      <Link to="/file-management/create-copy" className="flex items-center p-2 rounded hover:bg-gray-100">
                        创建副本
                      </Link>
                      <Link to="/file-management/new-canvas" className="flex items-center p-2 rounded hover:bg-gray-100">
                        新建画布
                      </Link>
                    </Accordion.Content>
                  </Accordion.Item>

                  {/* 导出管理 with sub-buttons */}
                  <Accordion.Item value="export-management">
                    <Accordion.Header>
                      <Accordion.Trigger className="w-full justify-start flex items-center p-2 rounded hover:bg-gray-100 focus:outline-none">
                        <FaFileExport className="mr-2" /> 导出管理
                        <ChevronDownIcon className="ml-auto transition-transform duration-200" />
                      </Accordion.Trigger>
                    </Accordion.Header>
                    <Accordion.Content className="pl-8 mt-2 space-y-1">
                      <Link to="/export-management/csv" className="flex items-center p-2 rounded hover:bg-gray-100">
                        导出为 CSV
                      </Link>
                      <Link to="/export-management/json" className="flex items-center p-2 rounded hover:bg-gray-100">
                        导出为 JSON
                      </Link>
                      <Link to="/export-management/pdf" className="flex items-center p-2 rounded hover:bg-gray-100">
                        导出为 PDF
                      </Link>
                      <Link to="/export-management/png" className="flex items-center p-2 rounded hover:bg-gray-100">
                        导出为 PNG
                      </Link>
                    </Accordion.Content>
                  </Accordion.Item>

                  {/* 模型管理 with sub-buttons */}
                  <Accordion.Item value="model-management">
                    <Accordion.Header>
                      <Accordion.Trigger className="w-full justify-start flex items-center p-2 rounded hover:bg-gray-100 focus:outline-none">
                        <FaCubes className="mr-2" /> 模型管理
                        <ChevronDownIcon className="ml-auto transition-transform duration-200" />
                      </Accordion.Trigger>
                    </Accordion.Header>
                    <Accordion.Content className="pl-8 mt-2 space-y-1">
                      <Link to="/model-management/speed-priority" className="flex items-center p-2 rounded hover:bg-gray-100">
                        速度优先
                      </Link>
                      <Link to="/model-management/performance-priority" className="flex items-center p-2 rounded hover:bg-gray-100">
                        性能优先
                      </Link>
                      <Link to="/model-management/accuracy-priority" className="flex items-center p-2 rounded hover:bg-gray-100">
                        精度优先
                      </Link>
                      <Link to="/model-management/custom-model" className="flex items-center p-2 rounded hover:bg-gray-100">
                        自定义模型
                      </Link>
                    </Accordion.Content>
                  </Accordion.Item>

                  {/* 格式管理 with sub-buttons */}
                  <Accordion.Item value="format-management">
                    <Accordion.Header>
                      <Accordion.Trigger className="w-full justify-start flex items-center p-2 rounded hover:bg-gray-100 focus:outline-none">
                        <FaFileCode className="mr-2" /> 格式管理
                        <ChevronDownIcon className="ml-auto transition-transform duration-200" />
                      </Accordion.Trigger>
                    </Accordion.Header>
                    <Accordion.Content className="pl-8 mt-2 space-y-1">
                      <Link to="/format-management/simplified-report" className="flex items-center p-2 rounded hover:bg-gray-100">
                        简化分析报告
                      </Link>
                      <Link to="/format-management/full-review-report" className="flex items-center p-2 rounded hover:bg-gray-100">
                        全条目审查报告
                      </Link>
                    </Accordion.Content>
                  </Accordion.Item>

                  {/* 智能优化 with sub-buttons */}
                  <Accordion.Item value="intelligent-optimization">
                    <Accordion.Header>
                      <Accordion.Trigger className="w-full justify-start flex items-center p-2 rounded hover:bg-gray-100 focus:outline-none">
                        <FaMagic className="mr-2" /> 智能优化
                        <ChevronDownIcon className="ml-auto transition-transform duration-200" />
                      </Accordion.Trigger>
                    </Accordion.Header>
                    <Accordion.Content className="pl-8 mt-2 space-y-1">
                      <Link to="/intelligent-optimization/intelligent-image-correction" className="flex items-center p-2 rounded hover:bg-gray-100">
                        智能矫正图像
                      </Link>
                      <Link to="/intelligent-optimization/partial-image-correction" className="flex items-center p-2 rounded hover:bg-gray-100">
                        部分矫正图像
                      </Link>
                      <Link to="/intelligent-optimization/dynamic-adjustment-area" className="flex items-center p-2 rounded hover:bg-gray-100">
                        动态调整区域
                      </Link>
                    </Accordion.Content>
                  </Accordion.Item>
                </Accordion.Root>
              </div>
            </div>
            {/* Main Content Area */}
            <div className="lg:col-span-3">
              <Routes>
                <Route path="/" element={<MainInterface />} />
                {/* File Management Routes */}
                <Route path="/file-management" element={<FileManagement />} />
                <Route path="/file-management/create-copy" element={<div>创建副本页面</div>} />
                <Route path="/file-management/new-canvas" element={<div>新建画布页面</div>} />
                <Route path="/file-management" element={<FileManagement />} />
                {/* Export Management Routes */}
                <Route path="/export-management" element={<ExportManagement />} />
                <Route path="/export-management/csv" element={<div>导出为CSV页面</div>} />
                <Route path="/export-management/json" element={<div>导出为JSON页面</div>} />
                <Route path="/export-management/pdf" element={<div>导出为PDF页面</div>} />
                <Route path="/export-management/png" element={<div>导出为PNG页面</div>} />
                <Route path="/export-management/png" element={<div>导出为PNG页面</div>} />
                {/* Model Management Routes */}
                <Route path="/model-management" element={<ModelManagement />} />
                <Route path="/model-management/speed-priority" element={<div>速度优先页面</div>} />
                <Route path="/model-management/performance-priority" element={<div>性能优先页面</div>} />
                <Route path="/model-management/accuracy-priority" element={<div>精度优先页面</div>} />
                <Route path="/model-management/custom-model" element={<div>自定义模型页面</div>} />
                <Route path="/format-management/simplified-report" element={<div>简化分析报告页面</div>} />
                {/* Format Management Routes */}
                <Route path="/format-management" element={<FormatManagement />} />
                <Route path="/format-management/simplified-report" element={<div>简化分析报告页面</div>} />
                <Route path="/format-management/full-review-report" element={<div>全条目审查报告页面</div>} />
                <Route path="/intelligent-optimization/dynamic-adjustment-area" element={<div>动态调整区域页面</div>} />
                {/* Intelligent Optimization Routes */}
                <Route path="/intelligent-optimization" element={<IntelligentOptimization />} />
                <Route path="/intelligent-optimization/intelligent-image-correction" element={<div>智能矫正图像页面</div>} />
                <Route path="/intelligent-optimization/partial-image-correction" element={<div>部分矫正图像页面</div>} />
                <Route path="/intelligent-optimization/dynamic-adjustment-area" element={<div>动态调整区域页面</div>} />
                <Route path="/model-management/custom-model" element={<div>自定义模型页面</div>} />
                {/* Top Navigation Routes */}
                <Route path="/account-management" element={<div>账户管理页面</div>} />
                <Route path="/file-settings/auto-compress" element={<div>自动压缩文件页面</div>} />
                <Route path="/file-settings/disable-compress" element={<div>禁止压缩文件页面</div>} />
                <Route path="/file-settings/auto-new-canvas" element={<div>自动新建画布页面</div>} />
                <Route path="/file-settings/auto-create-copy" element={<div>自动创建副本页面</div>} />
                <Route path="/backup-settings/enable-auto-backup" element={<div>开启自动备份页面</div>} />
                <Route path="/backup-settings/local-backup-only" element={<div>仅限本地备份页面</div>} />
                <Route path="/backup-settings/allow-cloud-backup" element={<div>允许云端备份页面</div>} />
                <Route path="/reset-settings" element={<div>重置初始设置页面</div>} />
                <Route path="/help" element={<div>帮助页面</div>} />
                <Route path="/account-settings" element={<AccountSettings />} />
              </Routes>
            </div>
          </div>
        </div>
      </div>
      
      {/* Blur overlay for login */}
      {!isAuthenticated && (
        <div className="fixed inset-0 bg-gray-100 bg-opacity-50 backdrop-filter backdrop-blur-sm z-40"></div>
      )}
      
      {/* AuthDialog */}
      {!isAuthenticated && (
        <AuthDialog
          isOpen={true}
          onClose={() => setIsAuthenticated(true)}
          onLogin={handleLogin}
        />
      )}
      
      {/* SettingsDialog */}
      <SettingsDialog 
        settings={settings} 
        setSettings={setSettings} 
        isOpen={isSettingsDialogOpen}
        onClose={() => setIsSettingsDialogOpen(false)}
      />
    </AppContext.Provider>
  );
}

export default App;