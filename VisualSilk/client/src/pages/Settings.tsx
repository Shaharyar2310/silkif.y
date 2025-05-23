import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTheme } from "@/hooks/useTheme";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Save, User, CreditCard, Image, Bell, Moon, Sun, Key } from "lucide-react";

export default function Settings() {
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  
  // Account settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);
  
  // Appearance settings
  const [highContrastMode, setHighContrastMode] = useState(false);
  const [largeText, setLargeText] = useState(false);
  
  // Privacy settings
  const [saveHistory, setSaveHistory] = useState(true);
  const [shareUsageData, setShareUsageData] = useState(true);
  
  const saveSettings = async () => {
    try {
      await apiRequest("POST", "/api/settings", {
        appearance: {
          theme,
          highContrastMode,
          largeText,
        },
        notifications: {
          emailNotifications,
          marketingEmails,
        },
        privacy: {
          saveHistory,
          shareUsageData,
        },
      });
      
      toast({
        title: "Settings saved",
        description: "Your settings have been updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error saving settings",
        description: "There was a problem saving your settings",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Settings</h1>
        <Button onClick={saveSettings} className="bg-buttonBg hover:bg-buttonActive">
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </div>
      
      <Tabs defaultValue="account" className="w-full">
        <TabsList className="grid grid-cols-4 w-full max-w-md mb-8">
          <TabsTrigger value="account">
            <User className="w-4 h-4 mr-2" />
            Account
          </TabsTrigger>
          <TabsTrigger value="appearance">
            <Moon className="w-4 h-4 mr-2" />
            Appearance
          </TabsTrigger>
          <TabsTrigger value="billing">
            <CreditCard className="w-4 h-4 mr-2" />
            Billing
          </TabsTrigger>
          <TabsTrigger value="privacy">
            <Key className="w-4 h-4 mr-2" />
            Privacy
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="account">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Manage your account information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white text-xl font-bold">
                    U
                  </div>
                  <div>
                    <p className="font-medium">Guest User</p>
                    <p className="text-sm text-gray-500">guest@example.com</p>
                  </div>
                </div>
                
                <Button variant="outline">Edit Profile</Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Control which notifications you receive</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-notifications">Email Notifications</Label>
                    <p className="text-sm text-gray-500">Receive email updates about your account</p>
                  </div>
                  <Switch
                    id="email-notifications"
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="marketing-emails">Marketing Emails</Label>
                    <p className="text-sm text-gray-500">Receive promotional emails and offers</p>
                  </div>
                  <Switch
                    id="marketing-emails"
                    checked={marketingEmails}
                    onCheckedChange={setMarketingEmails}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Appearance Settings</CardTitle>
              <CardDescription>Customize how Silkify looks for you</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Theme</Label>
                  <p className="text-sm text-gray-500">Choose between light and dark mode</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant={theme === "light" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTheme("light")}
                    className={theme === "light" ? "bg-buttonBg hover:bg-buttonActive" : ""}
                  >
                    <Sun className="w-4 h-4 mr-2" />
                    Light
                  </Button>
                  <Button
                    variant={theme === "dark" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTheme("dark")}
                    className={theme === "dark" ? "bg-buttonBg hover:bg-buttonActive" : ""}
                  >
                    <Moon className="w-4 h-4 mr-2" />
                    Dark
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="high-contrast">High Contrast Mode</Label>
                  <p className="text-sm text-gray-500">Increase contrast for better visibility</p>
                </div>
                <Switch
                  id="high-contrast"
                  checked={highContrastMode}
                  onCheckedChange={setHighContrastMode}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="large-text">Large Text</Label>
                  <p className="text-sm text-gray-500">Increase text size throughout the app</p>
                </div>
                <Switch
                  id="large-text"
                  checked={largeText}
                  onCheckedChange={setLargeText}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="billing">
          <Card>
            <CardHeader>
              <CardTitle>Subscription Plan</CardTitle>
              <CardDescription>Manage your subscription and billing information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium text-lg">Free Plan</h3>
                    <p className="text-sm text-gray-500">Limited access to basic features</p>
                  </div>
                  <Button className="bg-buttonBg hover:bg-buttonActive">Upgrade</Button>
                </div>
                
                <div className="mt-4 space-y-2">
                  <p className="text-sm flex items-center gap-2">
                    <Image className="w-4 h-4" />
                    <span>3 style transfers per day</span>
                  </p>
                  <p className="text-sm flex items-center gap-2">
                    <Image className="w-4 h-4" />
                    <span>5 AI image generations per day</span>
                  </p>
                  <p className="text-sm flex items-center gap-2">
                    <Bell className="w-4 h-4" />
                    <span>Basic customer support</span>
                  </p>
                </div>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium">Premium Plans</h3>
                
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium">Pro Plan</h4>
                    <p className="text-2xl font-bold mt-2">$9.99 <span className="text-sm font-normal">/month</span></p>
                    <ul className="mt-4 space-y-2 text-sm">
                      <li>Unlimited style transfers</li>
                      <li>50 AI image generations per day</li>
                      <li>Priority customer support</li>
                      <li>High-resolution outputs</li>
                    </ul>
                    <Button className="w-full mt-4 bg-buttonBg hover:bg-buttonActive">Select</Button>
                  </div>
                  
                  <div className="p-4 border rounded-lg border-primary">
                    <div className="flex justify-between">
                      <h4 className="font-medium">Business Plan</h4>
                      <span className="px-2 py-1 text-xs bg-primary text-white rounded-full">Best Value</span>
                    </div>
                    <p className="text-2xl font-bold mt-2">$24.99 <span className="text-sm font-normal">/month</span></p>
                    <ul className="mt-4 space-y-2 text-sm">
                      <li>Unlimited everything</li>
                      <li>API access</li>
                      <li>Dedicated support</li>
                      <li>Commercial usage rights</li>
                      <li>Team collaboration</li>
                    </ul>
                    <Button className="w-full mt-4 bg-buttonBg hover:bg-buttonActive">Select</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="privacy">
          <Card>
            <CardHeader>
              <CardTitle>Privacy Settings</CardTitle>
              <CardDescription>Control your data and privacy preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="save-history">Save History</Label>
                  <p className="text-sm text-gray-500">Keep a record of your image edits</p>
                </div>
                <Switch
                  id="save-history"
                  checked={saveHistory}
                  onCheckedChange={setSaveHistory}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="share-usage">Share Usage Data</Label>
                  <p className="text-sm text-gray-500">Help us improve by sharing anonymous usage data</p>
                </div>
                <Switch
                  id="share-usage"
                  checked={shareUsageData}
                  onCheckedChange={setShareUsageData}
                />
              </div>
              
              <div className="pt-4 border-t">
                <h3 className="font-medium mb-2">Data Management</h3>
                <div className="flex gap-4">
                  <Button variant="outline">Download My Data</Button>
                  <Button variant="destructive">Delete My Account</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
