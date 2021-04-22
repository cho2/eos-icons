;(function () {

  window
    .fetch('../js/glyph-list.json')
          .then(response => response.json())
          .then((data) => {
            try {

              const target = document.querySelector('#icons')
              // Filter EOS and MD icons
              let ligatures = data.glyphs
              console.log(ligatures);

              // Appends each icon to the preview wrap
              ligatures.forEach((glyph) => {
                const div = document.createElement('div')

                div.classList.add('icons__item')
                div.setAttribute('name', glyph)
                div.innerHTML = `
                      <i class="eos-icons">
                        ${glyph}
                      </i>
                      <i class="eos-icons-outlined">
                        ${glyph}
                      </i>
                      <br>
                      ${glyph}`
                target.append(div)
              })


            } catch (error) {
              console.error(error);
            }
          })

})()


