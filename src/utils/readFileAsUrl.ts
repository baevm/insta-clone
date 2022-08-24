export function readFileAsUrl(file: any) {
  return new Promise(function (resolve, reject) {
    let fr = new FileReader()

    fr.onload = function () {
      resolve(fr.result)
    }

    fr.onerror = function () {
      reject(fr)
    }

    fr.readAsDataURL(file)
  })
}
