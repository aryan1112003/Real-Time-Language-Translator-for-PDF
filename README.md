# PDF Language Translator 📖🌐

A powerful web application that allows users to upload PDF documents and translate them into multiple languages while maintaining text formatting. Built with React, TypeScript, and powered by Hugging Face's translation models.

![PDF Language Translator](https://i.imgur.com/YourScreenshot.png)

## 🌟 Features

- **PDF Text Extraction**: Extract text from PDF documents while preserving formatting
- **Multi-Language Support**: Translate text into 10 different languages:
  - French
  - Spanish
  - German
  - Italian
  - Portuguese
  - Russian
  - Japanese
  - Korean
  - Chinese
  - Hindi
- **Text-to-Speech**: Listen to the translated text with built-in speech synthesis
- **Download Translations**: Save translated text as a file
- **Dark Theme**: Modern, eye-friendly dark interface
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **File Size Limit**: Handles PDFs up to 10MB
- **Chunk Processing**: Efficiently processes large texts by splitting them into manageable chunks

## 🚀 Technologies Used

- **Frontend Framework**: React with TypeScript
- **Styling**: Tailwind CSS
- **PDF Processing**: PDF.js
- **Translation**: Hugging Face Inference API
- **File Handling**: React Dropzone
- **Icons**: Lucide React

## 🛠️ Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/pdf-language-translator.git
   ```

2. Install dependencies:
   ```bash
   cd pdf-language-translator
   npm install
   ```

3. Create a `.env` file and add your Hugging Face API token:
   ```env
   VITE_HUGGING_FACE_TOKEN=your_token_here
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## 💡 Usage

1. **Upload PDF**:
   - Drag and drop a PDF file into the upload area
   - Or click to select a file from your device
   - Maximum file size: 10MB

2. **Select Language**:
   - Choose your target translation language from the dropdown menu

3. **View and Interact**:
   - Original text appears on the left
   - Translated text appears on the right
   - Use the speak button to hear the translation
   - Download the translated text as a file

## 🔧 Technical Details

### PDF Processing
- Uses PDF.js to extract text from PDF documents
- Maintains text structure and formatting
- Processes documents page by page

### Translation
- Utilizes Hugging Face's Helsinki-NLP translation models
- Splits large texts into chunks for efficient processing
- Handles translation errors gracefully

### Performance Optimizations
- Lazy loading of components
- Efficient state management
- Chunked text processing
- Loading indicators for better UX

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Aryan Acharya**
- GitHub: [@aryan1112003](https://github.com/aryan1112003)
- LinkedIn: [Aryan Acharya](https://www.linkedin.com/in/aryan-acharya-9b939b316/)

## 🙏 Acknowledgments

- [Hugging Face](https://huggingface.co/) for their amazing translation models
- [PDF.js](https://mozilla.github.io/pdf.js/) for PDF processing capabilities
- All contributors and supporters of this project