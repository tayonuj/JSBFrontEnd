const getReadableFileSize = (_size) => {
    var fSExt = ['Bytes', 'KB', 'MB', 'GB'],
        i=0;while(_size>900){_size/=1024;i++;}
    var exactSize = (Math.round(_size*100)/100)+' '+fSExt[i];
    return exactSize;
}

export {getReadableFileSize}
