import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { User, Package, LogOut, FileText, ShieldAlert } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";

const ProfilePage = () => {
  const { user, signOut } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    setEmail(user.email || "");

    const fetchProfile = async () => {
      const { data } = await supabase
        .from("users")
        .select("name, phone_number, age, gender")
        .eq("id", user.id)
        .maybeSingle();

      if (data) {
        setName(data.name || "");
        setPhone(data.phone_number || "");
        setAge(data.age != null ? String(data.age) : "");
        setGender(data.gender || "");
      } else {
        setName(user.user_metadata?.name || "");
        setPhone(user.user_metadata?.phone_number || "");
      }
    };

    fetchProfile();
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!user) throw new Error("User not logged in");

      const { error: authError } = await supabase.auth.updateUser({
        data: { name, phone_number: phone },
      });
      if (authError) throw authError;

      const { error: profileError } = await supabase
        .from("users")
        .update(
          {
            phone_number:phone,
            name,
            age: age !== "" ? parseInt(age, 10) : null,
            gender: gender || null,
          }
        ).eq("id", user.id);
      if (profileError) throw profileError;

      toast({ title: "Profile updated!" });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    toast({ title: "Logged out" });
    navigate("/login");
  };

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="container mx-auto max-w-3xl px-4 py-12 md:py-16">
      <div className="mb-10 flex items-center gap-6">
        <Avatar className="h-20 w-20 shadow-lg">
          <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-display">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-1">
            {name}
          </h1>
          <p className="text-base text-muted-foreground">{email}</p>
        </div>
      </div>

      <div className="space-y-8">
        <Card className="border-border/50 shadow-lg">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center gap-3 text-2xl font-display">
              <User className="h-6 w-6 text-primary" /> Personal Information
            </CardTitle>
            <CardDescription className="text-base">Update your profile details</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium">Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age" className="text-sm font-medium">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    min={1}
                    max={120}
                    placeholder="e.g. 30"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender" className="text-sm font-medium">Gender</Label>
                  <Select value={gender} onValueChange={setGender}>
                    <SelectTrigger id="gender" className="h-11">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="profileEmail" className="text-sm font-medium">Email</Label>
                <Input
                  id="profileEmail"
                  value={email}
                  disabled
                  className="opacity-60 h-11"
                />
              </div>
              <Button type="submit" disabled={loading} className="h-11 px-8 font-semibold">
                {loading ? "Saving…" : "Save Changes"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-lg">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center gap-3 text-2xl font-display">
              <Package className="h-6 w-6 text-primary" /> Quick Links
            </CardTitle>
            <CardDescription className="text-base">Access important information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-start gap-3 h-12 text-base hover:bg-primary/5"
              onClick={() => navigate("/orders")}
            >
              <Package className="h-5 w-5" /> My Orders
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start gap-3 h-12 text-base hover:bg-primary/5"
              onClick={() => navigate("/disclaimer")}
            >
              <ShieldAlert className="h-5 w-5" /> View Disclaimers
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start gap-3 h-12 text-base hover:bg-primary/5"
              onClick={() => navigate("/faq")}
            >
              <FileText className="h-5 w-5" /> FAQ
            </Button>
          </CardContent>
        </Card>

        <Separator />

        <Button
          variant="outline"
          className="gap-2 text-destructive hover:bg-destructive/10 h-11 px-6 font-medium"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5" /> Sign Out
        </Button>
      </div>
    </div>
  );
};

export default ProfilePage;
