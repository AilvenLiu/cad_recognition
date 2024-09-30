import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { FaGoogle, FaGithub, FaQrcode, FaMicrosoft, FaBuilding } from 'react-icons/fa';

interface AuthDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: any) => void;
}

const AuthDialog: React.FC<AuthDialogProps> = ({ isOpen, onClose, onLogin }) => {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [loginMethod, setLoginMethod] = useState<'password' | 'otp' | 'qr' | 'sso'>('password');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement login logic here
    onLogin({ username: 'testuser' }); // Replace with actual user data
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement signup logic here
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{activeTab === 'login' ? '登录' : '注册'}</DialogTitle>
        </DialogHeader>
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'login' | 'signup')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">登录</TabsTrigger>
            <TabsTrigger value="signup">注册</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <form onSubmit={handleLogin}>
              {loginMethod === 'password' && (
                <>
                  <Input className="mb-2" type="text" placeholder="用户名" />
                  <Input className="mb-2" type="password" placeholder="密码" />
                </>
              )}
              {loginMethod === 'otp' && (
                <>
                  <Input className="mb-2" type="tel" placeholder="手机号码" />
                  <div className="flex mb-2">
                    <Input className="flex-grow mr-2" type="text" placeholder="验证码" />
                    <Button type="button">获取验证码</Button>
                  </div>
                </>
              )}
              {loginMethod === 'qr' && (
                <div className="flex justify-center items-center h-40 mb-2">
                  <FaQrcode size={100} />
                </div>
              )}
              {loginMethod === 'sso' && (
                <div className="flex flex-col space-y-2 mb-2">
                  <Button type="button" variant="outline" className="w-full">
                    <FaBuilding className="mr-2" /> 组织授权登录
                  </Button>
                  <Button type="button" variant="outline" className="w-full">
                    <FaMicrosoft className="mr-2" /> Microsoft SSO
                  </Button>
                </div>
              )}
              <div className="flex justify-between mb-2">
                <Button type="button" onClick={() => setLoginMethod('password')}>密码登录</Button>
                <Button type="button" onClick={() => setLoginMethod('otp')}>短信登录</Button>
                <Button type="button" onClick={() => setLoginMethod('qr')}>扫码登录</Button>
                <Button type="button" onClick={() => setLoginMethod('sso')}>SSO登录</Button>
              </div>
              <Button className="w-full mb-2" type="submit">登录</Button>
              <div className="flex justify-between">
                <Button type="button" variant="outline" className="flex-1 mr-2">
                  <FaGoogle className="mr-2" /> Google登录
                </Button>
                <Button type="button" variant="outline" className="flex-1">
                  <FaGithub className="mr-2" /> GitHub登录
                </Button>
              </div>
            </form>
          </TabsContent>
          <TabsContent value="signup">
            <form onSubmit={handleSignup}>
              <Input className="mb-2" type="text" placeholder="用户名" />
              <Input className="mb-2" type="email" placeholder="邮箱" />
              <Input className="mb-2" type="password" placeholder="密码" />
              <Input className="mb-2" type="password" placeholder="确认密码" />
              <Button className="w-full" type="submit">注册</Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AuthDialog;