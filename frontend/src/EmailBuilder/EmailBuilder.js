import React, { useState } from "react";
import './EmailBuilder.css';
import sale from './download.png'
import Newsletter from './tlp_hero_newsletter-templates-a29697c61b75af6c046f05af6c316d34.jpg'

// Example Templates
const ExampleTemplates = [
  {
    id: 1,
    title: 'Simple Newsletter',
    subject: 'Welcome to our Newsletter!',
    sections: [
      { type: 'text', content: 'Hello, welcome to our monthly newsletter.', styles: { fontSize: 16, fontWeight: 'bold', fontFamily: 'Arial', textAlign: 'center', color: '#000' }},
      { type: 'image', content: Newsletter, imageStyles: { width: '25%', height: 'auto', }},
      { type: 'text', content: 'Here we share the latest updates.', styles: { fontSize: 14, fontFamily: 'Arial', textAlign: 'left', color: '#333' }}
    ]
  },
  {
    id: 2,
    title: 'Sale Announcement',
    subject: '50% OFF Sale Starts Now!',
    sections: [
      { type: 'text', content: 'Hurry up! Our sale is live. Get 50% off on all products.', styles: { fontSize: 18, fontWeight: 'bold', fontFamily: 'Arial', textAlign: 'center', color: '#e60000' }},
      { type: 'image', content: sale, imageStyles: { width: '25%', height: 'auto' }},
      { type: 'text', content: 'Shop now and save big!', styles: { fontSize: 16, fontFamily: 'Arial', textAlign: 'left', color: '#333' }}
    ]
  }
];

const TextSection = ({ section, index, updateSection }) => {
  const handleStyleChange = (style, value) => {
    updateSection(index, {
      ...section,
      styles: { ...section.styles, [style]: value },
    });
  };

  return (
    <div className="section-container">
      <textarea
        value={section.content}
        onChange={(e) => updateSection(index, { ...section, content: e.target.value })}
        className="text-section-input"
        placeholder="Enter text here..."
      />
      <div className="text-style-buttons">
        <button onClick={() => handleStyleChange('fontWeight', section.styles.fontWeight === 'bold' ? 'normal' : 'bold')}>B</button>
        <button onClick={() => handleStyleChange('textDecoration', section.styles.textDecoration === 'underline' ? 'none' : 'underline')}>U</button>
        <input
          type="color"
          value={section.styles.color || '#000'}
          onChange={(e) => handleStyleChange('color', e.target.value)}
        />
        <input
          type="number"
          value={section.styles.fontSize || 16}
          onChange={(e) => handleStyleChange('fontSize', e.target.value)}
        />
      </div>
    </div>
  );
};

const ImageSection = ({ section, index, updateSection }) => {
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateSection(index, { ...section, content: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageResize = (style, value) => {
    updateSection(index, {
      ...section,
      imageStyles: { ...section.imageStyles, [style]: value },
    });
  };

  return (
    <div className="section-container">
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      {section.content && (
        <div className="image-preview">
          <img src={section.content} alt="Uploaded content" style={section.imageStyles} />
          <div className="image-resize-controls">
            <input
              type="number"
              value={section.imageStyles.width || 50}
              onChange={(e) => handleImageResize('width', e.target.value)}
              placeholder="Width"
            />
            <input
              type="number"
              value={section.imageStyles.height || 50}
              onChange={(e) => handleImageResize('height', e.target.value)}
              placeholder="Height"
            />
          </div>
        </div>
      )}
    </div>
  );
};

const TemplateEditor = ({ onSave }) => {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [editedTemplate, setEditedTemplate] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    setEditedTemplate({ ...template });
  };

  const addSection = (type) => {
    setEditedTemplate({
      ...editedTemplate,
      sections: [
        ...editedTemplate.sections,
        {
          type,
          content: '',
          styles: {},
          imageStyles: {}
        }
      ]
    });
  };

  const updateSection = (index, updatedSection) => {
    const newSections = [...editedTemplate.sections];
    newSections[index] = updatedSection;
    setEditedTemplate({ ...editedTemplate, sections: newSections });
  };

  const deleteSection = (index) => {
    const newSections = editedTemplate.sections.filter((_, idx) => idx !== index);
    setEditedTemplate({ ...editedTemplate, sections: newSections });
  };

  const moveSection = (index, direction) => {
    const newSections = [...editedTemplate.sections];
    const [removed] = newSections.splice(index, 1);
    newSections.splice(index + direction, 0, removed);
    setEditedTemplate({ ...editedTemplate, sections: newSections });
  };

  const handleSave = () => {
    if (!editedTemplate.title || !editedTemplate.subject) {
      setErrorMessage('Title and Subject are required.');
      return;
    }
    setErrorMessage('');
    if (typeof onSave === 'function') {
      onSave(editedTemplate);
    }
  };

  const handleDownload = () => {
    const templateHTML = `
      <html>
        <head><title>${editedTemplate.title}</title></head>
        <body>
          <h1>${editedTemplate.title}</h1>
          <h2>${editedTemplate.subject}</h2>
          ${editedTemplate.sections.map((section) => {
            if (section.type === 'text') {
              return `<p style="font-size: ${section.styles.fontSize}; font-weight: ${section.styles.fontWeight}; text-align: ${section.styles.textAlign}; color: ${section.styles.color};">${section.content}</p>`;
            }
            if (section.type === 'image') {
              return `<img src="${section.content}" style="width: ${section.imageStyles.width}; height: ${section.imageStyles.height};" />`;
            }
            return '';
          }).join('')}
        </body>
      </html>
    `;
    const blob = new Blob([templateHTML], { type: 'text/html' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${editedTemplate.title}.html`;
    link.click();
  };

  return (
    <div className="template-editor-container">
      <div className="template-selection">
        <h2>Select a Template</h2>
        <div className="template-list">
          {ExampleTemplates.map((template) => (
            <div key={template.id} className="template-item" onClick={() => handleTemplateSelect(template)}>
              <img src={template.content} alt="template preview" className="template-preview" style={template.imageStyles}/>
              <h3>{template.title}</h3>
              <p>{template.subject}</p>
              <button className="use-template-button">Use Template</button>
            </div>
          ))}
        </div>
      </div>

      {selectedTemplate && (
        <div className="template-editor">
          <div className="template-preview-container">
            <h3>Preview</h3>
            <div className="template-preview">
              <h2>{editedTemplate.title}</h2>
              <h4>{editedTemplate.subject}</h4>
              {editedTemplate.sections.map((section, index) => (
                <div key={index} className={`section-preview ${section.type}`}>
                  {section.type === 'text' ? (
                    <p style={section.styles}>{section.content}</p>
                  ) : (
                    <img src={section.content} alt="Uploaded content" style={section.imageStyles}px />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="template-editor-controls">
            <h3>Edit Template</h3>
            {errorMessage && <div className="error-message">{errorMessage}</div>}
            <input
              type="text"
              value={editedTemplate.title}
              onChange={(e) => setEditedTemplate({ ...editedTemplate, title: e.target.value })}
              className="title-input"
              placeholder="Template Title"
            />
            {editedTemplate.sections.map((section, index) => (
              <div key={index} className="section-editor">
                {section.type === 'text' ? (
                  <TextSection section={section} index={index} updateSection={updateSection} />
                ) : (
                  <ImageSection section={section} index={index} updateSection={updateSection} />
                )}
                <div className="section-controls">
                  <button onClick={() => moveSection(index, -1)} className="move-up-button">Up</button>
                  <button onClick={() => moveSection(index, 1)} className="move-down-button">Down</button>
                  <button onClick={() => deleteSection(index)} className="delete-button">Delete Section</button>
                </div>
              </div>
            ))}
            <div className="add-section-buttons">
              <button onClick={() => addSection('text')} className="add-button">Add Text Section</button>
              <button onClick={() => addSection('image')} className="add-button">Add Image Section</button>
            </div>
            <button onClick={handleSave} className="save-button">Save Template</button>
            <button onClick={handleDownload} className="download-button">Download Template</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplateEditor;
