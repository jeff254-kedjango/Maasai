export function formatDate(date){
    const dateObject = new Date(date);

    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
    };

    const formattedDate = dateObject.toLocaleDateString('en-US', options);

    return formattedDate;
}