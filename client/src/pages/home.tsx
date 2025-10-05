import { useState, useRef } from "react";
import { Sparkles, Download, ImageIcon, Loader2, Upload, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ThemeToggle } from "@/components/theme-toggle";
import { generateImageSchema, sizeOptions, type GenerateImageRequest } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

export default function Home() {
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [currentPrompt, setCurrentPrompt] = useState<string>("");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const form = useForm<GenerateImageRequest>({
    resolver: zodResolver(generateImageSchema),
    defaultValues: {
      prompt: "",
      size: "1024x1024",
      baseImage: undefined,
    },
  });

  const generateMutation = useMutation({
    mutationFn: async (data: GenerateImageRequest) => {
      const response = await apiRequest("POST", "/api/generate-image", data);
      const jsonData = await response.json();
      return jsonData as { imageData: string };
    },
    onSuccess: (data) => {
      if (data && data.imageData) {
        setGeneratedImage(data.imageData);
        setCurrentPrompt(form.getValues("prompt"));
        toast({
          title: "Image generated successfully!",
          description: "Your AI-generated image is ready to download.",
        });
      } else {
        toast({
          title: "Generation failed",
          description: "No image data received from server.",
          variant: "destructive",
        });
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Generation failed",
        description: error.message || "Failed to generate image. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file",
        description: "Please upload an image file.",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setUploadedImage(result);
      form.setValue('baseImage', result);
      toast({
        title: "Image uploaded",
        description: "Now describe how you want to edit it.",
      });
    };
    reader.readAsDataURL(file);
  };

  const removeUploadedImage = () => {
    setUploadedImage(null);
    form.setValue('baseImage', undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const onSubmit = (data: GenerateImageRequest, e?: React.BaseSyntheticEvent) => {
    e?.preventDefault();
    generateMutation.mutate(data);
  };

  const handleDownload = () => {
    if (!generatedImage) return;

    const link = document.createElement("a");
    link.href = generatedImage;
    const timestamp = new Date().getTime();
    link.download = `ai-generated-${timestamp}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Download started",
      description: "Your image is being downloaded.",
    });
  };

  const promptValue = form.watch("prompt");
  const charCount = promptValue?.length || 0;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <h1 className="bg-gradient-to-r from-primary via-chart-2 to-chart-3 bg-clip-text text-lg font-bold tracking-tight text-transparent md:text-xl">
              AI Banner & Image Generator
            </h1>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 md:px-8 md:py-12">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 md:gap-6">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <Badge variant="secondary" className="rounded-full px-4 py-1.5 text-xs">
              Text-to-Image
            </Badge>
            <Badge variant="secondary" className="rounded-full px-4 py-1.5 text-xs">
              Image Editing
            </Badge>
            <Badge variant="secondary" className="rounded-full px-4 py-1.5 text-xs">
              Custom Sizes
            </Badge>
            <Badge variant="secondary" className="rounded-full px-4 py-1.5 text-xs">
              Instant Download
            </Badge>
          </div>

          <div className="grid gap-8 lg:grid-cols-5 lg:gap-12">
            <div className="lg:col-span-2">
              <Form {...form}>
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    form.handleSubmit(onSubmit)(e);
                  }} 
                  className="space-y-6"
                >
                  <div>
                    <FormLabel className="text-sm font-medium mb-3 block">
                      Upload Image to Edit (Optional)
                    </FormLabel>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      data-testid="input-image-upload"
                    />
                    {uploadedImage ? (
                      <div className="relative rounded-xl border border-border bg-card p-3">
                        <img
                          src={uploadedImage}
                          alt="Uploaded"
                          className="h-32 w-full rounded-lg object-cover"
                          data-testid="uploaded-image-preview"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute right-2 top-2 h-8 w-8 rounded-full"
                          onClick={removeUploadedImage}
                          data-testid="button-remove-upload"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <Button
                        type="button"
                        variant="outline"
                        className="h-32 w-full rounded-xl border-2 border-dashed"
                        onClick={() => fileInputRef.current?.click()}
                        data-testid="button-upload-image"
                      >
                        <div className="flex flex-col items-center gap-2">
                          <Upload className="h-8 w-8 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            Click to upload an image
                          </span>
                        </div>
                      </Button>
                    )}
                  </div>

                  <FormField
                    control={form.control}
                    name="prompt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">
                          {uploadedImage ? "Describe Your Edits" : "Describe Your Image"}
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Textarea
                              placeholder={
                                uploadedImage
                                  ? "Add a sunset in the background, enhance colors, make it more vibrant..."
                                  : "A serene mountain landscape at sunset with vibrant orange and purple skies..."
                              }
                              className="min-h-32 resize-none rounded-xl border-input bg-card text-base focus-visible:ring-2 focus-visible:ring-ring"
                              {...field}
                              data-testid="input-prompt"
                            />
                            <div className="absolute bottom-3 right-3 text-xs text-muted-foreground">
                              {charCount}/1000
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="size"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">
                          Image Size
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger
                              className="h-12 rounded-xl bg-card"
                              data-testid="select-size"
                            >
                              <SelectValue placeholder="Select image size" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {sizeOptions.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                                data-testid={`option-${option.value}`}
                              >
                                <div className="flex flex-col items-start gap-0.5">
                                  <span className="font-medium">{option.label}</span>
                                  <span className="text-xs text-muted-foreground">
                                    {option.description}
                                  </span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    size="lg"
                    className="h-12 w-full rounded-xl md:h-14"
                    disabled={generateMutation.isPending || !promptValue}
                    data-testid="button-generate"
                  >
                    {generateMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        {uploadedImage ? "Editing..." : "Generating..."}
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-5 w-5" />
                        {uploadedImage ? "Edit Image" : "Generate Image"}
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </div>

            <div className="lg:col-span-3">
              <div className="sticky top-24">
                {!generatedImage && !generateMutation.isPending && (
                  <div
                    className="flex min-h-96 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-card p-8 text-center"
                    data-testid="empty-state"
                  >
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent">
                      <ImageIcon className="h-8 w-8 text-accent-foreground" />
                    </div>
                    <h3 className="mb-2 text-xl font-semibold">
                      Your Image Will Appear Here
                    </h3>
                    <p className="mb-6 max-w-sm text-sm text-muted-foreground">
                      Enter a detailed prompt and click generate to create stunning AI-powered images
                    </p>
                    <div className="flex flex-wrap justify-center gap-2 text-xs text-muted-foreground">
                      <span className="rounded-md bg-accent px-3 py-1.5">
                        "Futuristic cityscape"
                      </span>
                      <span className="rounded-md bg-accent px-3 py-1.5">
                        "Abstract art"
                      </span>
                      <span className="rounded-md bg-accent px-3 py-1.5">
                        "Nature scene"
                      </span>
                    </div>
                  </div>
                )}

                {generateMutation.isPending && (
                  <div
                    className="flex min-h-96 flex-col items-center justify-center rounded-2xl border border-border bg-card p-8"
                    data-testid="loading-state"
                  >
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                    <h3 className="mb-2 text-xl font-semibold">
                      Creating Your Image
                    </h3>
                    <p className="max-w-sm text-center text-sm text-muted-foreground">
                      Our AI is generating your image. This may take a few moments...
                    </p>
                  </div>
                )}

                {generatedImage && (
                  <div
                    className="animate-in fade-in zoom-in-95 duration-300"
                    data-testid="image-display"
                  >
                    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-lg">
                      <img
                        src={generatedImage}
                        alt={currentPrompt}
                        className="h-auto w-full"
                        data-testid="generated-image"
                      />
                    </div>
                    <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                      <p className="line-clamp-2 flex-1 text-sm text-muted-foreground">
                        {currentPrompt}
                      </p>
                      <Button
                        onClick={handleDownload}
                        variant="default"
                        size="lg"
                        className="h-12 w-full rounded-xl md:w-auto"
                        data-testid="button-download"
                      >
                        <Download className="mr-2 h-5 w-5" />
                        Download
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
