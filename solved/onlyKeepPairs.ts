// Write your code here
const X = (s: string) => {
  let freq = new Array(26).fill(0)
  s.split('').forEach(c => {
    freq[c.charCodeAt(0) - 'a'.charCodeAt(0)] += 1
  })
  freq = freq.filter(cnt => cnt > 0)

  for (let i = 0; i < freq.length; i++) {
    let copyOfF = [...freq]

    if (copyOfF[i] === 1) {
      copyOfF.splice(i, 1)
    } else {
      copyOfF[i] = copyOfF[i] - 1
    }

    if (new Set(copyOfF).size == 1) {
      return 'YES'
    }
  }
  return 'NO'
}



console.log (X('aaaabbcc'))
console.log(X('aaaaabc'))
console.log (X('aabbcd'))

console.log (X('abbac'))
console.log (X('aabbc'))
console.log (X(`ibfdgaeadiaefgbhbdghhhbgdfgeiccbiehhfcggchgghadhdhagfbahhddgghbdehidbibaeaagaeeigffcebfbaieggabcfbiiedcabfihchdfabifahcbhagccbdfifhghcadfiadeeaheeddddiecaicbgigccageicehfdhdgafaddhffadigfhhcaedcedecafeacbdacgfgfeeibgaiffdehigebhhehiaahfidibccdcdagifgaihacihadecgifihbebffebdfbchbgigeccahgihbcbcaggebaaafgfedbfgagfediddghdgbgehhhifhgcedechahidcbchebheihaadbbbiaiccededchdagfhccfdefigfibifabeiaccghcegfbcghaefifbachebaacbhbfgfddeceababbacgffbagidebeadfihaefefegbghgddbbgddeehgfbhafbccidebgehifafgbghafacgfdccgifdcbbbidfifhdaibgigebigaedeaaiadegfefbhacgddhchgcbgcaeaieiegiffchbgbebgbehbbfcebciiagacaiechdigbgbghefcahgbhfibhedaeeiffebdiabcifgccdefabccdghehfibfiifdaicfedagahhdcbhbicdgibgcedieihcichadgchgbdcdagaihebbabhibcihicadgadfcihdheefbhffiageddhgahaidfdhhdbgciiaciegchiiebfbcbhaeagccfhbfhaddagnfieihghfbaggiffbbfbecgaiiidccdceadbbdfgigibgcgchafccdchgifdeieicbaididhfcfdedbhaadedfageigfdehgcdaecaebebebfcieaecfagfdieaefdiedbcadchabhebgehiidfcgahcdhcdhgchhiiheffiifeegcfdgbdeffhgeghdfhbfbifgidcafbfcd`))