import { useState, useContext, useEffect } from 'react';
import { AppContext, AppContextType } from '../App';
import ImageUpload from './ImageUpload';
import { Button } from "@/components/ui/button";

function MainInterface() {
  const {
    doCreate
  } = useContext(AppContext) as AppContextType;

  const [analysisStage, setAnalysisStage] = useState<'initial' | 'processing' | 'result'>('initial');
  const [isAnalysisComplete, setIsAnalysisComplete] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (analysisStage === 'processing') {
      setIsAnalysisComplete(false);
      setProgress(0);
      
      timer = setInterval(() => {
        setProgress((prevProgress) => {
          if (prevProgress >= 100) {
            clearInterval(timer);
            setIsAnalysisComplete(true);
            return 100;
          }
          return prevProgress + 10;
        });
      }, 500);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [analysisStage]);

  return (
    <div className="bg-white rounded-lg p-6 shadow-lg">
      {analysisStage === 'initial' && (
        <>
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">上传CAD文件</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-semibold mb-2 text-gray-700">图纸 1</h3>
              <ImageUpload setReferenceImages={(images) => doCreate(images, 'image')} />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2 text-gray-700">图纸 2</h3>
              <ImageUpload setReferenceImages={(images) => doCreate(images, 'image')} />
            </div>
          </div>
          <Button
            onClick={() => setAnalysisStage('processing')}
            className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            开始分析
          </Button>
        </>
      )}

      {analysisStage === 'processing' && (
        <div>
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">正在处理...</h2>
          <p className="mb-4">请稍等，系统正在分析您上传的CAD图纸。这个过程可能需要几分钟。</p>
          <div className="flex space-x-4 mt-4 mb-6">
            <img src="/input/0.jpeg" alt="Input Image 1" className="w-1/2 rounded-lg shadow-md" />
            <img src="/input/1.jpeg" alt="Input Image 2" className="w-1/2 rounded-lg shadow-md" />
          </div>
          <div className="mb-6">
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
              <div 
                className="bg-blue-600 h-2.5 rounded-full" 
                style={{width: `${progress}%`}}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-2">分析进度：{progress}%</p>
          </div>
          <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-6" role="alert">
            <p className="font-bold">当前进行的步骤：</p>
            <p>1. 图像预处理 - 完成</p>
            <p>2. 特征提取 - 进行中</p>
            <p>3. 图纸比较 - 等待中</p>
            <p>4. 生成分析报告 - 等待中</p>
          </div>
          <Button
            onClick={() => setAnalysisStage('result')}
            className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white"
            disabled={!isAnalysisComplete}
          >
            {isAnalysisComplete ? '查看结果' : '分析中...'}
          </Button>
        </div>
      )}

      {analysisStage === 'result' && (
        <div>
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">分析结果</h2>
          <div className="space-y-6">
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
              <p className="font-bold text-blue-700">分析概要：</p>
              <p className="text-blue-600">系统通过比较两张CAD图纸，识别出它们描述的是同一实体，但存在一些设计上的差异。以下是详细分析：</p>
            </div>
            <div>
              <p><strong>是否描述同一实体：</strong> 是</p>
              <p className="text-sm text-gray-600 mt-1">根据管道的整体布局和主要特征，系统判断两张图纸描述的是同一个管道系统。</p>
            </div>
            <div>
              <strong>相似之处：</strong>
              <ul className="list-disc list-inside mt-2">
                <li>管道直径相同</li>
                <li>材料类型一致</li>
              </ul>
              <p className="text-sm text-gray-600 mt-1">这些相似点表明两个设计的基本参数是一致的，可能是同一项目的不同版本。</p>
            </div>
            <div>
              <strong>差异：</strong>
              <ul className="list-disc list-inside mt-2">
                <li>管道长度不同</li>
                <li>连接方式有变化</li>
              </ul>
              <p className="text-sm text-gray-600 mt-1">这些差异可能反映了设计的迭代或针对特定需求的调整。</p>
            </div>
            <div>
              <p><strong>质量评估：</strong> 图纸质量良好，细节清晰</p>
              <p className="text-sm text-gray-600 mt-1">高质量的图纸有助于准确理解设计意图和实施工程。</p>
            </div>
            <div>
              <p><strong>标准符合性：</strong> 符合行业标准XYZ-2023</p>
              <p className="text-sm text-gray-600 mt-1">符合最新标准表明设计考虑了当前的安全和效率要求。</p>
            </div>
            <div>
              <strong>安全问题：</strong>
              <ul className="list-disc list-inside mt-2">
                <li>需要增加防腐蚀措施</li>
                <li>建议增加应急切断阀</li>
              </ul>
              <p className="text-sm text-gray-600 mt-1">这些建议旨在提高系统的安全性和可靠性。</p>
            </div>
            <div>
              <p><strong>成本分析：</strong> 新设计预计可减少10%的材料成本</p>
              <p className="text-sm text-gray-600 mt-1">成本降低可能是由于更高效的管道布局或材料选择的优化。</p>
            </div>
            <div>
              <p><strong>环境影响：</strong> 新设计可减少5%的能源消耗</p>
              <p className="text-sm text-gray-600 mt-1">能源效率的提升有助于减少运营成本和环境影响。</p>
            </div>
          </div>
          <div className="mt-6 p-4 bg-yellow-50 border-l-4 border-yellow-500 text-yellow-700">
            <p className="font-bold">注意事项：</p>
            <p>此分析结果基于AI系统的自动识别和比较。虽然系统努力提供准确的信息，但最终决策应由专业工程师确认。建议将此报告作为参考，并结合专业知识和实际情况进行综合评估。</p>
          </div>
          <Button
            onClick={() => setAnalysisStage('initial')}
            className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            重新开始
          </Button>
        </div>
      )}
    </div>
  );
}

export default MainInterface;