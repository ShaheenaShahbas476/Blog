import React, { useState, useRef } from "react";
import axios from "axios";
import { Editor } from '@tinymce/tinymce-react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';

const CreateBlog = () => {
  const [title, setTitle] = useState("");
  const [intro, setIntro] = useState("");
  const [styles, setStyles] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [categories, setCategories] = useState("");
  const [cardImage, setCardImage] = useState(""); // New state for card image

  const editorRef = useRef(null);

  // Handle image upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("photo", file);

    try {
      const response = await axios.post("http://localhost:3001/upload-photo", formData);
      if (response.data.photo.photo_url) {
        setCardImage(`http://localhost:3001${response.data.photo.photo_url}`);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Image upload failed. Please try again.");
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    const htmlContent = editorRef.current.getContent();

    try {
      const response = await axios.post("http://localhost:3001/create-blog", {
        title,
        intro,
        body: htmlContent,
        styles,
        authorName,
        categories: categories.split(","), // Send categories as an array
        image_url: cardImage, // Send the card image URL
      });

      if (response.status === 200) {
        alert("Blog successfully submitted");
        // Reset form fields
        setTitle("");
        setIntro("");
        setStyles("");
        setAuthorName("");
        setCategories("");
        setCardImage(""); // Reset card image URL
        editorRef.current.setContent(''); // Clear TinyMCE content
      }
    } catch (error) {
      console.error("Error submitting blog:", error);
      alert("Failed to submit the blog. Please try again.");
    }
  };

  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col md={8}>
          <h2 className="text-center my-4">Create a Blog</h2>
          <Form onSubmit={submit}>
            <Form.Group className="mb-3" controlId="formTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Enter blog title" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                required 
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formIntro">
              <Form.Label>Intro</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={3}
                placeholder="Write a short introduction" 
                value={intro} 
                onChange={(e) => setIntro(e.target.value)} 
                required
              />
            </Form.Group>

            <Form.Group controlId="formCardImage" className="mb-3">
              <Form.Label>Card Image</Form.Label>
              <Form.Control type="file" accept="image/*" onChange={handleImageUpload} />
              {cardImage && <img src={cardImage} alt="Card preview" className="img-preview mt-3" />}
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBody">
              <Form.Label>Content</Form.Label>
              <Editor
  tinymceScriptSrc="/tinymce/js/tinymce/tinymce.min.js"
  onInit={(evt, editor) => editorRef.current = editor}
  initialValue="<p>This is the initial content of the editor.</p>"
  init={{
    height: 500,
    menubar: 'favs file edit view insert format tools table help',
    menu: {
      file: { title: 'File', items: 'newdocument restoredraft | preview | export print | deleteallconversations' },
      edit: { title: 'Edit', items: 'undo redo | cut copy paste pastetext | selectall | searchreplace' },
      view: { title: 'View', items: 'code | visualaid visualchars visualblocks | spellchecker | preview fullscreen | showcomments' },
      insert: { title: 'Insert', items: 'image link media addcomment pageembed template codesample inserttable | charmap emoticons hr | pagebreak nonbreaking anchor tableofcontents | insertdatetime' },
      format: { title: 'Format', items: 'bold italic underline strikethrough superscript subscript codeformat | styles blocks fontfamily fontsize align lineheight | forecolor backcolor | language | removeformat' },
      tools: { title: 'Tools', items: 'spellchecker spellcheckerlanguage | a11ycheck code wordcount' },
      table: { title: 'Table', items: 'inserttable | cell row column | advtablesort | tableprops deletetable' },
      help: { title: 'Help', items: 'help' },
    },
    plugins: [
      'advlist', 'autolink', 'link', 'image', 'lists', 'charmap', 'preview', 'anchor', 'pagebreak',
      'searchreplace', 'wordcount', 'visualblocks', 'visualchars', 'code', 'fullscreen',
      'insertdatetime', 'media', 'table', 'emoticons', 'template', 'spellchecker',
      'a11ychecker', 'fullscreen', 'hr', 'nonbreaking', 'pagebreak', 'anchor'
    ],
    toolbar: 'undo redo | bold italic underline strikethrough superscript subscript | alignleft aligncenter alignright alignjustify | ' +
      'bullist numlist outdent indent | link image media table | ' +
      'forecolor backcolor emoticons | charmap | fontselect fontsizeselect formatselect | ' +
      'fullscreen preview print searchreplace | hr pagebreak nonbreaking anchor | ' +
      'tableprops tablecellprops advtablesort | showcomments | code | a11ycheck',
    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
    image_advtab: true,
    branding: false,
    resize: true,
    statusbar: true,
    
    // Custom image upload handler for TinyMCE
    images_upload_handler: async (blobInfo, success, failure) => {
      try {
        const formData = new FormData();
        formData.append('photo', blobInfo.blob(), blobInfo.filename());

        const response = await fetch('http://localhost:3001/upload-photo', {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();
        if (response.ok && data.photo && data.photo.photo_url) {
          success(`http://localhost:3001${data.photo.photo_url}`);
        } else {
          failure('Image upload failed: ' + (data.message || 'Unknown error'));
        }
      } catch (error) {
        console.error('Image upload error:', error);
        failure('An error occurred while uploading the image');
      }
    },

    // Enable image upload by defining a file picker callback
    file_picker_callback: function (callback, value, meta) {
      if (meta.filetype === 'image') {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');

        input.onchange = function () {
          const file = input.files[0];
          const reader = new FileReader();
          
          reader.onload = function (e) {
            callback(e.target.result, { alt: file.name });
          };
          reader.readAsDataURL(file);
        };
        
        input.click();
      }
    },
  }}
/>

            </Form.Group>

            <Form.Group className="mb-3" controlId="formStyles">
              <Form.Label>Styles (CSS or inline styles)</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={3}
                placeholder="Specify custom styles for the blog"
                value={styles}
                onChange={(e) => setStyles(e.target.value)} 
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formAuthorName">
              <Form.Label>Author Name</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Enter the author's name" 
                value={authorName} 
                onChange={(e) => setAuthorName(e.target.value)} 
                required 
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formCategories">
              <Form.Label>Categories (comma-separated)</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Enter categories (e.g., Finops 22, Finops 23, Finops 24)" 
                value={categories} 
                onChange={(e) => setCategories(e.target.value)} 
                required 
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="mt-3">
              Submit
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default CreateBlog;
