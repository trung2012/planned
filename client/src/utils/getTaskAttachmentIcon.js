import React from 'react';

import { ReactComponent as PhotoIcon } from '../assets/photo.svg';
import { ReactComponent as PaperClipIcon } from '../assets/paper_clip.svg';
import { ReactComponent as PdfIcon } from '../assets/pdf.svg';
import { ReactComponent as MSWordIcon } from '../assets/ms_word.svg';
import { ReactComponent as MSExcelIcon } from '../assets/ms_excel.svg';

export default (name) => {
  if (name.toLowerCase().includes('.jpg') || name.toLowerCase().includes('.png')) {
    return <PhotoIcon className='attachment-icon' />
  } else if (name.toLowerCase().includes('.pdf')) {
    return <PdfIcon className='attachment-icon' />
  } else if (name.toLowerCase().includes('.doc')) {
    return <MSWordIcon className='attachment-icon' />
  } else if (name.toLowerCase().includes('.xls')) {
    return <MSExcelIcon className='attachment-icon' />
  } else {
    return <PaperClipIcon className='attachment-icon' />
  }
}