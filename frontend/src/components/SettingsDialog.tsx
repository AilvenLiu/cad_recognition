import React from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EditorTheme, Settings } from "../types";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger } from "./ui/select";
import { capitalize } from "../lib/utils";
import { IS_RUNNING_ON_CLOUD } from "../config";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";

interface Props {
  settings: Settings;
  setSettings: React.Dispatch<React.SetStateAction<Settings>>;
  isOpen: boolean;
  onClose: () => void;
}

function SettingsDialog({ settings, setSettings, isOpen, onClose }: Props) {
  const handleThemeChange = (theme: EditorTheme) => {
    setSettings((s) => ({
      ...s,
      editorTheme: theme,
    }));
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">设置</DialogTitle>
        </DialogHeader>
        <div className="mt-6 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="openai-api-key" className="text-lg font-medium">OpenAI API Key</Label>
            <Input
              id="openai-api-key"
              placeholder="输入您的OpenAI API Key"
              value={settings.openAiApiKey || ""}
              onChange={(e) => setSettings((s) => ({ ...s, openAiApiKey: e.target.value }))}
              className="w-full"
            />
            <p className="text-sm text-gray-500">该key只存储在浏览器中，不会上传到服务器。</p>
          </div>

          {!IS_RUNNING_ON_CLOUD && (
            <div className="space-y-2">
              <Label htmlFor="openai-base-url" className="text-lg font-medium">OpenAI Base URL (可选)</Label>
              <Input
                id="openai-base-url"
                placeholder="输入自定义的OpenAI Base URL"
                value={settings.openAiBaseURL || ""}
                onChange={(e) => setSettings((s) => ({ ...s, openAiBaseURL: e.target.value }))}
                className="w-full"
              />
              <p className="text-sm text-gray-500">如果不想使用默认URL，请输入代理URL。</p>
            </div>
          )}

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="theme-settings">
              <AccordionTrigger className="text-lg font-medium">主题设置</AccordionTrigger>
              <AccordionContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="app-theme" className="text-base">应用主题</Label>
                  <button
                    className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 rounded-md transition-colors hover:bg-gray-300 dark:hover:bg-gray-600"
                    onClick={() => {
                      document.body.classList.toggle("dark");
                      // Add logic to save theme preference
                    }}
                  >
                    切换黑暗模式
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="editor-theme" className="text-base">编辑器主题</Label>
                  <Select
                    name="editor-theme"
                    value={settings.editorTheme}
                    onValueChange={(value) => handleThemeChange(value as EditorTheme)}
                  >
                    <SelectTrigger className="w-[140px]">
                      {capitalize(settings.editorTheme)}
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cobalt">Cobalt</SelectItem>
                      <SelectItem value="espresso">Espresso</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
              保存
            </button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default SettingsDialog;