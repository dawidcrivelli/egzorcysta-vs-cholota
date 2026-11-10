/* Piksel: pociski w locie na siatce pikseli tej samej wielkości co postacie. PIX.PROJ(kind,x,y,rot,v,rowH) → true.
   Obrót co 90°, żeby piksele zostały pikselami. */
(()=>{
const PIX=window.PIX;if(!PIX||!PIX.paint)return;
const M={
 boot:["WWWW..","GGGG..","kkkk..","kkkk..","kkkk..","kkkkkk","kkkkkk","gggggg"],
 soap:["rWrWr","GGGGG","GzZzG","GZzZG","GzZzG",".GGG."],
 ball:[".kk.","kGkk","kkkk",".kk."],
 holy:[".n.",".B.","BBB","BWB","BBB"],
 food0:[".zZ.","zZzZ","ZzZz",".Zz."],
 food1:[".NN.","NnNN",".NN."],
 food2:["W....W","WWWWWW","W....W"]
};
const rot90=m=>{const h=m.length,w=m[0].length,o=[];for(let x=0;x<w;x++){let r='';for(let y=h-1;y>=0;y--)r+=m[y][x];o.push(r);}return o;};
PIX.PROJ=(kind,x,y,rot,v,rowH)=>{
 let m=M[kind]||M['food'+(v||0)];if(!m)return false;
 if(kind!=='ball'){const q=((Math.round((rot||0)/(Math.PI/2))%4)+4)%4;for(let i=0;i<q;i++)m=rot90(m);}
 PIX.begin();PIX.layer(PIX.stamp(m,-(m[0].length>>1),-(m.length>>1)));PIX.paint(x,y,rowH*0.88/PIX.ROWS,0,null);return true;
};
})();
