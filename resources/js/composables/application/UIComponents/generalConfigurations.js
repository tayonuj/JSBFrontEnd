const checkUserGoThroughTheDetails = (form,currentTab) => {
    let allSections = _.map(form,'section');
    let currentIndex = _.findIndex(allSections,o=> o === currentTab);
    if (currentIndex < allSections.length-1){
        let nextIndex = currentIndex+1;
        return form[nextIndex].section
    }else{
        return 'completed';
    }
}

const getDates = (field,section,type,frmdata) => {
    if (field.component === 'ujDatepicker' && field[type]) {
        if (field[type] === 'current') {
            return new Date();
        } else if (frmdata[section] && frmdata[section][field[type]]) {
            return new Date(frmdata[section][field[type]]);
        } else {
            return new Date(field[type]);
        }
    }
}

export {checkUserGoThroughTheDetails,getDates}
