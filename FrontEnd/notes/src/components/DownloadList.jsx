import React, {useEffect} from 'react';
import { PDFDownloadLink, usePDF } from '@react-pdf/renderer';
import {Document, Paragraph, TextRun, HeadingLevel, Packer} from 'docx';
import {saveAs} from 'file-saver';
import PdfPage from './PdfPage';

function DownloadList({noteName, noteContent, noteDrawnContent}) {

  

  function handleDownloadTXT() {
      var anchor = document.createElement('a');
      var text = handleProcessContentTXT();
      anchor.href = 'data:text/plain;charset=utf-8,'+'--------------------------\n'+noteName+'\n--------------------------\n\n'+text;
      anchor.download = `${noteName}.txt`;
  
      anchor.click();
  }
  
  function handleProcessContentTXT() {
    var content = JSON.parse(noteContent);
  
    content = content.split('<div>').join('\n');
    content = content.split('</div>').join('');
    content = content.split('<br>').join('');
    content = content.split('<b>').join('');
    content = content.split('</b>').join('');
  
    return content
  }

  function handleProcessContentPDF() {
    var content = JSON.parse(noteContent);

    content = content.split('</div>').join('');
    content = content.split('<br>').join('');
    content = content.split('<b>').join('');
    content = content.split('</b>').join('');
    content = content.split('<div>');
    return content;
  }
  var noteContentPDF = handleProcessContentPDF();


  function handleDownloadDOCX() {
    var content = handleProcessContentTXT()
    let doc = new Document({
      sections: [
        {
          children: [
            new Paragraph({
              text: noteName,
              heading: HeadingLevel.TITLE,
            
            })
          ]
        },
        {
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: content
                })
              ]
            })
          ]
        }
      ]
    })

    Packer.toBlob(doc).then(blob => {
      saveAs(blob, `${noteName}.docx`)
    })

  }

  return (
    <div className='download-list'>
        <button className={'download-btn'} onClick={handleDownloadTXT}>Download .txt</button>
        {noteContentPDF.length > 0 && (
          <PDFDownloadLink className={'download-btn'} document={<PdfPage noteName={noteName} noteContent={noteContentPDF} noteDrawnContent={noteDrawnContent} />} fileName={`${noteName}.pdf`}>
            {({ blob, url, loading, error }) =>
              loading ? 'Loading document...' : 'Download .pdf'
            }
          </PDFDownloadLink>
        )}
        <button className={'download-btn'} onClick={handleDownloadDOCX}>Download .docx</button>
    </div>
  )
}

export default DownloadList;