export type CategoryId = "all" | "pdf" | "img" | "video" | "utils" | "dev" | "security" | "data" | "audio" | "social";

export type Tool = {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: Exclude<CategoryId, "all">;
  popular?: boolean;
  soon?: boolean;
  isNew?: boolean;
};

export const CATEGORIES: { id: CategoryId; label: string; emoji: string }[] = [
  { id: "all",      label: "All tools",      emoji: "⚡" },
  { id: "pdf",      label: "PDF Tools",      emoji: "📄" },
  { id: "img",      label: "Image Tools",    emoji: "🖼️" },
  { id: "video",    label: "Video Tools",    emoji: "🎬" },
  { id: "dev",      label: "Dev Hub",        emoji: "💻" },
  { id: "security", label: "Security Suite", emoji: "🔐" },
  { id: "data",     label: "Data Workshop",  emoji: "📊" },
  { id: "audio",    label: "Audio Studio",   emoji: "🎵" },
  { id: "social",   label: "Social Toolkit", emoji: "📱" },
  { id: "utils",    label: "Local Utils",    emoji: "🛠️" },
];

export const CAT_LABEL: Record<CategoryId, string> = {
  all:      "All",
  pdf:      "PDF",
  img:      "Image",
  video:    "Video",
  dev:      "Dev Hub",
  security: "Security",
  data:     "Data",
  audio:    "Audio",
  social:   "Social",
  utils:    "Utils",
};

export const TOOLS: Tool[] = [
  // PDF Section
  { id: "merge-pdf",        name: "Merge PDF",          icon: "🔗", description: "Combine multiple PDF files into one document in seconds.",                    category: "pdf", popular: true  },
  { id: "split-pdf",        name: "Split PDF",           icon: "✂️", description: "Extract pages or split a PDF into multiple separate files.",                  category: "pdf", popular: true  },
  { id: "compress-pdf",     name: "Compress PDF",        icon: "📦", description: "Reduce PDF file size while keeping the best possible quality.",               category: "pdf", popular: true  },
  { id: "pdf-to-jpg",       name: "PDF to JPG",          icon: "🖼️", description: "Convert every PDF page into a high-quality JPG image.",                       category: "pdf"                },
  { id: "jpg-to-pdf",       name: "JPG to PDF",          icon: "📎", description: "Turn one or more images into a single PDF document.",                         category: "pdf"                },
  { id: "rotate-pdf",       name: "Rotate PDF",          icon: "🔄", description: "Fix page orientation — rotate any page to the right angle.",                  category: "pdf"                },
  { id: "watermark-pdf",    name: "Watermark PDF",       icon: "💧", description: "Stamp a custom text or image watermark on every page.",                       category: "pdf"                },
  { id: "protect-pdf",      name: "Protect PDF",         icon: "🔒", description: "Lock your PDF with a password to keep it private.",                          category: "pdf"                },
  { id: "unlock-pdf",       name: "Unlock PDF",          icon: "🔓", description: "Remove the password from a PDF you own.",                                     category: "pdf"                },
  { id: "reorder-pdf",      name: "Reorder Pages",       icon: "🗂️", description: "Drag and drop pages to rearrange them in any order.",                         category: "pdf", isNew: true    },
  { id: "pdf-to-text",      name: "PDF to Text",         icon: "📝", description: "Extract all text content from your PDF.",                                   category: "pdf", isNew: true    },
  { id: "pdf-grayscale",    name: "PDF Grayscale",       icon: "🔘", description: "Convert a color PDF to black & white.",                                     category: "pdf", isNew: true    },
  { id: "add-page-numbers", name: "Add Page Numbers",    icon: "🔢", description: "Stamp page numbers on every page of your PDF.",                             category: "pdf", isNew: true    },
  { id: "pdf-metadata",     name: "PDF Metadata",        icon: "🏷️", description: "View and edit PDF title, author, subject and keywords.",                    category: "pdf", isNew: true    },
  
  // Image Section
  { id: "compress-image",   name: "Compress Image",      icon: "🗜️", description: "Reduce image file size with smart quality control.",                         category: "img", popular: true  },
  { id: "resize-image",     name: "Resize Image",        icon: "📐", description: "Resize images to exact dimensions or by percentage.",                        category: "img", popular: true  },
  { id: "convert-image",    name: "Convert Image",       icon: "🔄", description: "Convert between JPG, PNG, WebP, BMP, GIF and more.",                        category: "img", isNew: true },
  { id: "rotate-image",     name: "Rotate & Flip",       icon: "↩️", description: "Rotate images and flip them horizontally or vertically.",                    category: "img", isNew: true },
  { id: "crop-image",       name: "Crop Image",          icon: "✂️", description: "Crop images to the exact size you need.",                                   category: "img", isNew: true },
  { id: "watermark-image",  name: "Watermark Image",     icon: "💧", description: "Add a text watermark to protect your images.",                              category: "img", isNew: true },
  { id: "color-picker",     name: "Color Extractor",     icon: "🎨", description: "Extract dominant color palettes directly from any image.", category: "img", soon: true },

  // Video Section
  { id: "compress-video",   name: "Compress Video",      icon: "📦", description: "Reduce video file size while preserving quality.",                           category: "video", popular: true },
  { id: "convert-video",    name: "Convert Video",       icon: "🔄", description: "Convert between MP4, WebM, AVI, MOV and more.",                             category: "video", popular: true },
  { id: "trim-video",       name: "Trim Video",          icon: "✂️", description: "Cut your video — set a start and end point to keep only what you need.",    category: "video", popular: true },
  { id: "extract-audio",    name: "Extract Audio",       icon: "🎵", description: "Pull the audio track from any video as MP3, WAV or AAC.",                   category: "video" },
  { id: "video-to-gif",     name: "Video to GIF",        icon: "🎞️", description: "Convert a short video clip into an animated GIF.",                          category: "video" },
  { id: "mute-video",       name: "Mute Video",          icon: "🔇", description: "Remove the audio track from a video completely.",                            category: "video" },
  { id: "rotate-video",     name: "Rotate Video",        icon: "↩️", description: "Rotate or flip a video in any direction.",                                  category: "video" },
  { id: "subtitle-generator", name: "Subtitle Generator", icon: "💬", description: "Auto-generate subtitles from any video or audio file locally.",             category: "video", popular: true },

  // Dev Hub
  { id: "svg-optimizer",    name: "SVG Optimizer",       icon: "🖌️", description: "Clean up and minify SVG code for faster web performance.",                   category: "dev", isNew: true, soon: true },
  { id: "regex-tester",     name: "Regex Tester",        icon: "🔍", description: "Test and build complex regular expressions with real-time feedback.",         category: "dev", isNew: true, soon: true },
  { id: "jwt-decoder",      name: "JWT Decoder",         icon: "🎫", description: "Safely inspect and decode JSON Web Tokens locally in your browser.",        category: "dev", isNew: true, soon: true },
  { id: "sql-formatter",    name: "SQL Formatter",       icon: "📂", description: "Pretty-print or minify SQL queries for better readability.",                category: "dev", isNew: true, soon: true },
  { id: "crontab-generator", name: "Crontab Generator",  icon: "⏰", description: "Visual editor to generate cron schedules for your server tasks.",            category: "dev", isNew: true, soon: true },
  { id: "json-formatter",   name: "JSON Formatter",      icon: "{} ", description: "Instantly format, validate, and minify messy JSON code offline.",           category: "dev", isNew: true },

  // Security Suite
  { id: "metadata-scrubber", name: "Metadata Scrubber",   icon: "🕵️", description: "Remove EXIF metadata like GPS and camera info from your photos.",           category: "security", isNew: true, soon: true },
  { id: "file-encryptor",   name: "File Encryptor",      icon: "🔐", description: "Lock any file with military-grade AES encryption before uploading.",         category: "security", isNew: true, soon: true },
  { id: "ssh-key-gen",     name: "SSH Key Generator",   icon: "🔑", description: "Generate secure public and private key pairs for your servers.",             category: "security", isNew: true, soon: true },
  { id: "digital-signatures", name: "Digital Signatures", icon: "🖋️", description: "Sign documents and verify signatures locally on your device.",                category: "security", isNew: true, soon: true },

  // Data Workshop
  { id: "csv-json-excel",   name: "Data Converter",      icon: "📑", description: "Seamlessly convert between CSV, JSON, and Excel formats instantly.",         category: "data", isNew: true, soon: true },
  { id: "xml-formatter",    name: "XML Formatter",       icon: "📄", description: "Handle complex XML structures with formatting and minification.",            category: "data", isNew: true, soon: true },
  { id: "data-visualizer",  name: "Data Visualizer",     icon: "📈", description: "Paste a CSV and generate beautiful charts and graphs instantly.",           category: "data", isNew: true, soon: true },
  { id: "unit-converter",   name: "Unit Converter",      icon: "📏", description: "Professional-grade conversion for technical and daily units.",              category: "data", isNew: true, soon: true },

  // Audio Studio
  { id: "mp3-trimmer",      name: "Audio Trimmer",       icon: "✂️", description: "Cut and join MP3, WAV or AAC audio files with precision.",                  category: "audio", isNew: true, soon: true },
  { id: "audio-merger",     name: "Audio Merger",        icon: "🔗", description: "Combine multiple audio tracks into a single high-quality file.",             category: "audio", isNew: true, soon: true },
  { id: "volume-booster",   name: "Volume Booster",      icon: "🔊", description: "Increase or normalize audio levels without loss of quality.",              category: "audio", isNew: true, soon: true },
  { id: "audio-converter",  name: "Format Converter",    icon: "🔄", description: "Convert between FLAC, WAV, MP3 and other audio formats.",                   category: "audio", isNew: true, soon: true },

  // Social Toolkit
  { id: "aspect-ratio-crop", name: "Social Crop",         icon: "📐", description: "One-tap crop for Instagram, TikTok, and YouTube aspect ratios.",             category: "social", isNew: true, soon: true },
  { id: "thumbnail-maker",  name: "Thumbnail Maker",     icon: "🖼️", description: "Quickly create thumbnails with text overlays and background effects.",      category: "social", isNew: true, soon: true },
  { id: "privacy-blur",     name: "Privacy Blur",        icon: "🌫️", description: "Blur faces, license plates, or sensitive info in videos and photos.",        category: "social", isNew: true, soon: true },

  // Utils Section
  { id: "create-zip",       name: "Create ZIP",          icon: "🤐", description: "Quickly bundle multiple local files into a single ZIP archive.",             category: "utils", isNew: true },
  { id: "extract-zip",      name: "Extract ZIP",         icon: "📂", description: "View and extract files from a ZIP archive directly in-browser.",            category: "utils", isNew: true },
  { id: "screen-recorder",  name: "Screen Recorder",     icon: "⏺️", description: "Record your screen and browser audio directly without extensions.",          category: "utils", isNew: true },
  { id: "base64-converter", name: "Base64 Encoder",      icon: "🔤", description: "Convert files or text to Base64 format instantly in-browser.",              category: "utils", isNew: true },
  { id: "hash-generator",   name: "MD5/SHA Files",       icon: "🔐", description: "Generate secure hashes of your local files for verification.",               category: "utils", isNew: true },
  { id: "password-gen",     name: "Password Generator",  icon: "🔑", description: "Generate military-grade secure passwords locally on your device.",            category: "utils", isNew: true },
  { id: "qr-generator",     name: "QR Code Generator",   icon: "📱", description: "Create downloadable QR codes for URLs, WiFi, or plain text.",               category: "utils", isNew: true },
  { id: "markdown-editor",  name: "Local MD Editor",     icon: "📝", description: "Real-time Markdown editor and previewer with export options.",              category: "utils", isNew: true }
];
