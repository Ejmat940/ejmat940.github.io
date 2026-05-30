// Style array
const styles =
    [{name:"Styl1", file:"/style-1.css"},
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
    styles.forEach(s => {
        const btn = document.createElement("button");
        btn.textContent = s.name;

        btn.onclick = () => {
            style(s.file);
        };

        document.body.prepend(btn);
    });
}
changeStyle();