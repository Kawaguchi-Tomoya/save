import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { User, Pin } from '../types';
import { Shield } from 'lucide-react';
import { toast } from 'sonner';
import { SelectPostHistory } from './SelectPostHistory';
import { UserReactionViewScreen } from './UserReactionViewScreen';
import { SelectUserSetting } from './SelectUserSetting';

interface UserDisplayMyPageProps {
  user: User;
  pins: Pin[];
  reactedPins: Pin[];
  onPinClick: (pin: Pin) => void;
  onDeletePin: (pinId: string) => void;
  onUpdateUser: (user: User) => void;
  onNavigateToDeleteAccount: () => void;
}

export function UserDisplayMyPage({ 
  user, pins, reactedPins, onPinClick, onDeletePin, onUpdateUser, onNavigateToDeleteAccount 
}: UserDisplayMyPageProps) {
  const [showBusinessRegistration, setShowBusinessRegistration] = useState(false);

  const handleBusinessRegistration = () => {
    toast.success('事業者登録申請を送信しました。運営からの承認をお待ちください。');
    setShowBusinessRegistration(false);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>マイページ</CardTitle>
            <CardDescription>アカウント情報と投稿履歴</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">ユーザー名</p>
                <p>匿名</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">メールアドレス</p>
                <p>{user.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">アカウント種別</p>
                <Badge variant="outline">一般</Badge>
              </div>
              <div>
                <p className="text-sm text-gray-600">登録日</p>
                <p>{formatDate(user.createdAt)}</p>
              </div>
            </div>

            {!showBusinessRegistration && (
              <Button onClick={() => setShowBusinessRegistration(true)} variant="outline">
                <Shield className="w-4 h-4 mr-2" />
                事業者登録を申請
              </Button>
            )}

            {showBusinessRegistration && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
                <p className="text-sm font-bold">事業者登録申請</p>
                <p className="text-xs text-gray-600">
                  事業者として登録すると、店舗名での投稿やダッシュボード機能が利用できます。
                </p>
                <div className="space-y-2">
                  <input type="text" placeholder="店舗名" className="w-full px-3 py-2 border rounded-lg" />
                  <input type="tel" placeholder="電話番号" className="w-full px-3 py-2 border rounded-lg" />
                  <input type="text" placeholder="住所" className="w-full px-3 py-2 border rounded-lg" />
                </div>
                <div className="flex space-x-2">
                  <Button onClick={handleBusinessRegistration} size="sm">申請する</Button>
                  <Button onClick={() => setShowBusinessRegistration(false)} variant="outline" size="sm">キャンセル</Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Tabs defaultValue="posts" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="posts">投稿履歴 ({pins.length})</TabsTrigger>
            <TabsTrigger value="reactions">リアクション ({reactedPins.length})</TabsTrigger>
            <TabsTrigger value="settings">設定</TabsTrigger>
          </TabsList>

          {/* 投稿一覧 */}
          <TabsContent value="posts" className="space-y-4">
            <SelectPostHistory 
                pins={pins} 
                onPinClick={onPinClick} 
                onDeletePin={onDeletePin} 
            />
          </TabsContent>

          {/* リアクション履歴 */}
          <TabsContent value="reactions" className="space-y-4">
            <UserReactionViewScreen 
                reactedPins={reactedPins} 
                onPinClick={onPinClick} 
            />
          </TabsContent>

          {/* 設定 */}
          <TabsContent value="settings" className="space-y-4">
            <SelectUserSetting 
                user={user}
                onUpdateUser={onUpdateUser}
                onNavigateToDeleteAccount={onNavigateToDeleteAccount}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}