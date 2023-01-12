export function footer(){
    const year = new Date().getFullYear();
    document.querySelector('#copyright-year').textContent = year;
}