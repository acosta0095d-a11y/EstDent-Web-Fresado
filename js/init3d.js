// Inicializar 3D con logging completo
function init3D() {
    console.log('=== INICIANDO 3D ===');
    console.log('THREE disponible:', typeof THREE !== 'undefined');
    console.log('STLLoader disponible:', typeof THREE !== 'undefined' && typeof THREE.STLLoader !== 'undefined');
    
    const container = document.getElementById('stl-container');
    const status = document.getElementById('stl-status');
    
    if (!container) {
        console.error('❌ Contenedor STL no encontrado');
        if (status) status.innerHTML = '<div class="flex flex-col items-center justify-center h-full"><div class="text-red-400 font-bold">ERROR: Contenedor no encontrado</div></div>';
        return;
    }

    if (typeof THREE === 'undefined') {
        console.error('❌ THREE.js no está disponible');
        if (status) {
            status.innerHTML = '<div class="flex flex-col items-center justify-center h-full"><div class="text-red-400 font-bold">ERROR: THREE.js no cargó</div></div>';
            status.style.backgroundColor = 'rgba(220, 38, 38, 0.9)';
            status.style.display = 'flex';
        }
        return;
    }

    if (!THREE.STLLoader) {
        console.error('❌ STLLoader no está disponible');
        if (status) {
            status.innerHTML = '<div class="flex flex-col items-center justify-center h-full"><div class="text-red-400 font-bold">ERROR: STLLoader no cargó</div></div>';
            status.style.backgroundColor = 'rgba(220, 38, 38, 0.9)';
            status.style.display = 'flex';
        }
        return;
    }

    try {
        if (status) {
            status.style.display = 'flex';
            status.innerHTML = '<div class="text-center"><div>Cargando modelo 3D...</div><div class="text-xs mt-2">Esto puede tomar unos segundos</div></div>';
        }
        console.log('✅ Iniciando escena Three.js...');
        
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setClearColor(0x0f172a, 0);
        container.appendChild(renderer.domElement);
        console.log('✅ Renderer creado');

        const loader = new THREE.STLLoader();
        console.log('📥 Cargando STL desde: models/Dientes3D.stl');
        
        loader.load('models/Dientes3D.stl', function (geometry) {
            if (status) status.style.display = 'none';
            console.log('✅ STL cargado exitosamente');
            
            geometry.center();
            
            const material = new THREE.MeshStandardMaterial({ 
                color: 0xe8d4c0,
                roughness: 1,
                metalness: 0
            }); 
            const mesh = new THREE.Mesh(geometry, material);
            mesh.name = 'toothMesh';
            
            mesh.position.set(0, 0, 0);
            mesh.rotation.y = Math.PI;
            scene.add(mesh);
            
            const box = new THREE.Box3().setFromObject(mesh);
            const size = box.getSize(new THREE.Vector3()).length();
            
            camera.position.x = size * 0.4;
            camera.position.y = size * 0.3;
            camera.position.z = size * 0.5;
            camera.lookAt(0, 0, 0);
            
            console.log('✅ Modelo 3D inicializado correctamente');
        }, 
        (xhr) => {
            const percent = xhr.total ? Math.round(xhr.loaded / xhr.total * 100) : 0;
            console.log(`📊 Progreso: ${percent}%`);
            if (status && xhr.total) {
                status.innerHTML = `<div class="flex flex-col items-center justify-center h-full"><div>Cargando... ${percent}%</div></div>`;
            }
        },
        (error) => {
            console.error('❌ Error cargando el STL:', error);
            if (status) {
                status.innerHTML = `<div class="flex flex-col items-center justify-center h-full text-center"><div class="text-red-400 font-bold">Error al cargar el modelo</div><div class="text-xs mt-2">${error.message || 'Verifica la consola'}</div></div>`;
                status.style.backgroundColor = 'rgba(239, 68, 68, 0.95)';
                status.style.display = 'flex';
            }
        });

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
        scene.add(ambientLight);
        
        const light1 = new THREE.DirectionalLight(0xffffff, 0.8);
        light1.position.set(30, 30, 40);
        scene.add(light1);
        
        const light2 = new THREE.DirectionalLight(0xffffff, 0.2);
        light2.position.set(-30, -30, -40);
        scene.add(light2);

        function animate() {
            requestAnimationFrame(animate);
            const mesh = scene.getObjectByName('toothMesh');
            if (mesh) {
                mesh.rotation.x += 0.003;
                mesh.rotation.y += 0.005;
            }
            renderer.render(scene, camera);
        }

        function resizeRenderer() {
            if (!container) return;
            const width = container.clientWidth;
            const height = container.clientHeight;
            renderer.setSize(width, height);
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
        }

        window.addEventListener('resize', resizeRenderer);
        window.addEventListener('orientationchange', resizeRenderer);
        
        setTimeout(resizeRenderer, 100);
        animate();
        console.log('✅ Animación 3D iniciada');

    } catch (error) {
        console.error('❌ Error fatal en Three.js:', error);
        if (status) {
            status.innerHTML = `<div class="flex flex-col items-center justify-center h-full"><div class="text-red-400 font-bold">Error: ${error.message}</div></div>`;
            status.style.backgroundColor = 'rgba(239, 68, 68, 0.95)';
            status.style.display = 'flex';
        }
    }

    // Configurar video
    const videoDientes = document.getElementById('video-dientes');
    if (videoDientes) {
        console.log('🎬 Configurando video...');
        
        videoDientes.loop = true;
        videoDientes.muted = true;
        videoDientes.autoplay = true;
        videoDientes.playsInline = true;
        videoDientes.playbackRate = 1.35;

        const intentarReproducir = () => {
            const playPromise = videoDientes.play();
            if (playPromise) {
                playPromise.then(() => {
                    console.log('✅ Video reproduciéndose');
                }).catch((error) => {
                    console.warn('⚠️ Autoplay bloqueado:', error);
                    const retryPlay = () => {
                        videoDientes.play().catch(() => {});
                        document.removeEventListener('click', retryPlay);
                        document.removeEventListener('touchstart', retryPlay);
                    };
                    document.addEventListener('click', retryPlay, { once: true });
                    document.addEventListener('touchstart', retryPlay, { once: true });
                });
            }
        };

        if (videoDientes.readyState >= 2) {
            intentarReproducir();
        } else {
            videoDientes.addEventListener('loadeddata', intentarReproducir);
        }

        videoDientes.addEventListener('error', (e) => {
            console.error('❌ Error en video:', e);
        });
    } else {
        console.error('❌ Video no encontrado');
    }
}

console.log('🚀 Script init3d.js cargado. Verificando estado del DOM...');
if (document.readyState === 'loading') {
    console.log('⏳ DOM aún cargando, esperando DOMContentLoaded...');
    document.addEventListener('DOMContentLoaded', () => {
        console.log('✅ DOMContentLoaded disparado');
        init3D();
    });
} else {
    console.log('✅ DOM ya cargado, iniciando inmediatamente...');
    init3D();
}
