---
title: "Bonsai Tree"
subtitle: "Responsible for pot modeling and texturing, tree generation, photogrammetry scan processing, tree texturing, and rendering"
date: 2024-02-15 00:00:00
description: 
featured_image: "/images/bonsai/bonsai_main.jpg"
---

## Final render

<div class="gallery" data-columns="1">
	<img src="/images/bonsai/bonsai_final_render.png">
</div>



<br/>

## Lighting

<div class="gallery" data-columns="2">
	<img src="/images/bonsai/bonsai_lighting_1.png">
    <img src="/images/bonsai/bonsai_lighting_2.png">
</div>

The scene uses an HDRI image, two box lights, and one directional light to achieve a realistic, warm lighting setup.



<br/>

## Texture showcase

<div class="gallery" data-columns="1">
	<img src="/images/bonsai/bonsai_texture_1.png">
</div>

Subsurface scattering in the leaf textures allows for a realistic look when combined with the lighting [^1].

<div class="gallery" data-columns="2">
	<img src="/images/bonsai/bonsai_texture_2.png">
    <img src="/images/bonsai/bonsai_texture_3.png">
</div>

Photo scanned textures present an unrivaled level of detail. Textures must be baked from a photo-scanned log on to a lower polygon-count mesh for efficient use in baking. From this bake can textures be exported from Agisoft Metashape as basecolor, normal. ambient occlusion, and height maps. A simple translation show below in Substance Designer will allow that scanned texture to be used in a PBR workflow. 

<div class="gallery" data-columns="1">
	<img src="/images/bonsai/bonsai_texture_4.png">
</div>

[^1]: Leaf textures downloaded from [3D Scanned European Beech Tree Leaves Atlas 02 (textures.com)](https://www.textures.com/download/3DAtlas0364/136884) 
    
    Flower textures downloaded from [​3D Scanned Magnolia Atlas (textures.com)](https://www.textures.com/download/3DAtlas0033/133343)