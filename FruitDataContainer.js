const TypeOfFruit =
{
    WaterMelon: 'WaterMelon',
    Banana: 'Banana',
    Apple: 'Apple',
    Mango: 'Mango',
    Pineapple: 'Pineapple',
    Cherry: 'Cherry',
    Kiwi: 'Kiwi'
}



const FruitDatas = {
    WaterMelon: createFruit(TypeOfFruit.WaterMelon,'./Asset/Emoji/Angry.png', 15, 10),
    Banana: createFruit(TypeOfFruit.Banana, './Asset/Emoji/Sick.png', 20, 20),
    Apple: createFruit(TypeOfFruit.Apple, './Asset/Emoji/Sad.png', 25, 30),
    Mango: createFruit(TypeOfFruit.Mango, './Asset/Emoji/Normal.png', 30, 40),
    Pineapple: createFruit(TypeOfFruit.Pineapple,'./Asset/Emoji/Happy.png', 35, 50),
    Cherry: createFruit(TypeOfFruit.Cherry,'./Asset/Emoji/WOW.png', 40, 60),
    Kiwi: createFruit(TypeOfFruit.Kiwi,'./Asset/Emoji/Funny.png', 45, 70),
  };
  
  function createFruit(type, srcIMG, radius, score) {
    return {
      type,
      srcIMG,
      radius,
      score,
    };
  }






function GetListFruitDatas()
{
    let listFruits = Object.values(TypeOfFruit);
    return listFruits;
}


function GetLastFruit()
{
    let listFruits = Object.values(TypeOfFruit);
    const lastIndex = listFruits.length-1;
    return listFruits[lastIndex];
}

function GetRamdomTypeFruit() {
    const fruits = Object.values(TypeOfFruit);

    const randomIndex = Math.floor(Math.random() * fruits.length/2);
    return fruits[randomIndex];

}

function GetAssetFruit(type) {
    return Object.values(FruitDatas).find(fruit => fruit.type === type);
}


function getNextFruit(current) {
    const fruits = Object.values(TypeOfFruit);
    const currentIndex = fruits.indexOf(current);
    if (currentIndex === -1) {
        throw new Error('Fruit not found');
    }
    const nextIndex = (currentIndex + 1) % fruits.length;
    return GetAssetFruit( fruits[nextIndex]) ;
}

