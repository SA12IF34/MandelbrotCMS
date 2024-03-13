import {useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MdArrowRight, MdArrowLeft } from "react-icons/md";
import '../../App.css';

type props = {
  dual: boolean,
  data: object | materialsType | null
}

type materialsType = Array<object> | null | undefined;

function MaterialsContainer({dual=true, data}: props) {

  const [materials, setMaterials] = useState<materialsType>(undefined);

  function handleSetAnime(e: any) {
    (e.target as HTMLButtonElement).classList?.add('chosen');
    (e.target as HTMLButtonElement).parentElement?.querySelector('.game')?.classList.remove('chosen');
    (e.target as HTMLButtonElement).parentElement?.querySelector('.other')?.classList.remove('chosen');
    (e.target as HTMLButtonElement).parentElement?.querySelector('.shows')?.classList.remove('chosen');

    setMaterials(data!['anime' as keyof typeof data]);
  }

  function handleSetGames(e: any) {
    (e.target as HTMLButtonElement).classList?.add('chosen');
    (e.target as HTMLButtonElement).parentElement?.querySelector('.anime')?.classList.remove('chosen');
    (e.target as HTMLButtonElement).parentElement?.querySelector('.other')?.classList.remove('chosen');
    (e.target as HTMLButtonElement).parentElement?.querySelector('.shows')?.classList.remove('chosen');

    setMaterials(data!['game' as keyof typeof data]);
  }

  function handleSetShows(e: any) {
    const target = e.target as HTMLButtonElement;
    target.classList?.add('chosen');
    target.parentElement?.querySelector('.anime')?.classList.remove('chosen');
    target.parentElement?.querySelector('.game')?.classList.remove('chosen');
    target.parentElement?.querySelector('.other')?.classList.remove('chosen');
  }

  function handleSetOther(e: any) {
    const target = e.target as HTMLButtonElement;
    target.classList?.add('chosen');
    target.parentElement?.querySelector('.anime')?.classList.remove('chosen');
    target.parentElement?.querySelector('.game')?.classList.remove('chosen');
    target.parentElement?.querySelector('.shows')?.classList.remove('chosen');

    setMaterials(data!['other' as keyof typeof data]);
  }


  useEffect(() => {    


    if (dual && data) {
      setMaterials(data['anime' as keyof typeof data])
    } else if (!dual && data) {
      setMaterials((data as materialsType));
    }

    let rightBtns = document.querySelectorAll('button.right') as NodeListOf<HTMLButtonElement>;
    let leftBtns = document.querySelectorAll('button.left') as NodeListOf<HTMLButtonElement>;
      
  
    rightBtns.forEach((rightBtn, index) => {
      let translateValue = 0;
      let translateCount = 0;
      
    rightBtn.addEventListener('click', (e) => {

      let container = (e.target as HTMLElement)?.parentElement?.querySelector('.materials') as HTMLElement;
      const fullWidth = document.body.offsetWidth;
      const elementWidth = (container.firstElementChild as HTMLElement).offsetWidth;
      let gap = 10;
      let limit = 1;
      
      if (fullWidth <= 1280 && fullWidth > 912) {
        limit = 4;
      } 
      if (fullWidth <= 912 && fullWidth > 744) {
        limit = 3;
      }
      if (fullWidth <= 744 && fullWidth > 500) {
        limit=2;
      }
      
      if (translateCount < container.childNodes.length-limit){
        translateValue -= elementWidth+gap;
        container.style.cssText = `transform: translateX(${translateValue}px)`
        translateCount += 1  
      }
          
    })
      
    leftBtns[index].addEventListener('click', (e) => {
    
      if (translateCount === 0) {
        return;
      }
    
      let container = (e.target as HTMLElement).parentElement?.querySelector('.materials') as HTMLElement;
      const elementWidth = (container.firstElementChild as HTMLElement).offsetWidth;
      let gap = 10;
    
      translateValue += elementWidth+gap;
      translateCount -= 1;
      container.style.cssText = `transform: translateX(${translateValue}px)`;
      
    })
        
  })
  
}, [])

  return (
    <div className={`container ${!dual ? 'container-not-dual' : ''}`}>
          <div>
            <div className='materials'>
              {materials && materials!.length > 0 ? materials?.map((material) => {
                return (
                  <Link className='material' to={`/entertainment/materials/${material['id' as keyof typeof material]}/`}>
                    <div>
                      <div className='image'>
                        <img src={material['image' as keyof typeof material] 
                        ? material['image' as keyof typeof material] 
                        : 'https://st3.depositphotos.com/23594922/31822/v/450/depositphotos_318221368-stock-illustration-missing-picture-page-for-website.jpg' } 
                        alt={material['name' as keyof typeof material]} />
                      </div>
                      <span>{(material['name' as keyof typeof material] as string).slice(0, 21)}{(material['name' as keyof typeof material] as string).length > 20 ? '...': ''}</span>
                    </div>
                  </Link>
                )
              }) : (
                <h1 style={{margin: '20px', color: 'white', maxWidth: 'calc(100% - 80px)'}}>There are no materials</h1>
              )}
            </div>
          </div>
          <button className="left direction"><MdArrowLeft /></button>
          <button className="right direction"><MdArrowRight /></button>
          {dual && (
            <div className='type-btns'>
              <button onClick={handleSetAnime} className="anime type chosen">anime</button>
              <button onClick={handleSetGames} className="game type">game</button>
              <button onClick={handleSetShows} className="shows type">shows & movies</button>
              <button onClick={handleSetOther} className='other type'>other</button>
            </div>
          )}
        </div>
  )
}

export default MaterialsContainer