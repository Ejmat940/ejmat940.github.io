const msg: string = "Hello!";
alert(msg);

// Style array
const styles = [{name:"Styl1", file:"/style-1.css"},
    {name: "Styl2", file:"/style-2.css"},
    {name: "Styl3", file:"/style-3.css"}];

// Set style
function style(fileName: string) {
    // Delete previous style
    const last = document.getElementById("dynamic-style");
    if (last) last.remove();

    // Create <link>
    const link = document.createElement("link");
    link.id = "dynamic-style";
    link.rel = "stylesheet";
    link.href = fileName;

    // Add to head
    document.head.appendChild(link);
}
style(styles[0].file);

// Change style
function changeStyle() {
    let currentIndex = 0;

    const btn = document.createElement("button");
    btn.textContent = "Zmień styl";

    // Change index
    btn.onclick = () => {
        if (currentIndex === 0) {
            currentIndex = 1;
        } else if (currentIndex === 1) {
            currentIndex = 2;
        } else {
            currentIndex = 0;
        }

        style(styles[currentIndex].file);
    };
    // Add button
    document.body.prepend(btn);
}
changeStyle();
