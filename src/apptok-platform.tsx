import React, { useState, useEffect, useRef } from 'react';
import { Heart, MessageSquare, Share2, ChevronUp, ChevronDown, User, Search, PlusSquare, Bell, Home, Compass, Sparkles, Code, Save, Play, Pause } from 'lucide-react';

// サンプルアプリのコレクション - 実際のサービスではAIが生成したものを保存
const SAMPLE_APPS = [
  {
    id: 'app1',
    title: 'インタラクティブな色彩マンダラ',
    description: 'クリックとドラッグで美しい幾何学パターンを生成します。',
    creator: {
      id: 'user1',
      username: 'artlover',
      avatar: '/api/placeholder/50/50'
    },
    likes: 1254,
    comments: 42,
    shares: 287,
    aiPrompt: 'カラフルなインタラクティブな幾何学アートを作成するアプリを作って',
    html: `
    <div id="canvas-container" style="width: 100%; height: 100%; display: flex; justify-content: center; align-items: center; background-color: #111;">
      <canvas id="mandalaCanvas" width="400" height="400" style="background-color: #000;"></canvas>
    </div>
    <script>
      const canvas = document.getElementById('mandalaCanvas');
      const ctx = canvas.getContext('2d');
      let isDrawing = false;
      let symmetry = 12;
      let lastX = canvas.width / 2;
      let lastY = canvas.height / 2;
      let hue = 0;

      function draw(x, y) {
        if (!isDrawing) return;
        
        ctx.strokeStyle = \`hsl(\${hue}, 100%, 50%)\`;
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        
        const angle = Math.PI * 2 / symmetry;
        
        for (let i = 0; i < symmetry; i++) {
          ctx.save();
          ctx.translate(centerX, centerY);
          ctx.rotate(angle * i);
          ctx.beginPath();
          
          // Draw relative to center
          ctx.moveTo(lastX - centerX, lastY - centerY);
          ctx.lineTo(x - centerX, y - centerY);
          ctx.stroke();
          
          // Mirror
          ctx.beginPath();
          ctx.moveTo(-(lastX - centerX), lastY - centerY);
          ctx.lineTo(-(x - centerX), y - centerY);
          ctx.stroke();
          
          ctx.restore();
        }
        
        lastX = x;
        lastY = y;
        hue = (hue + 1) % 360;
      }

      canvas.addEventListener('mousedown', (e) => {
        isDrawing = true;
        const rect = canvas.getBoundingClientRect();
        lastX = e.clientX - rect.left;
        lastY = e.clientY - rect.top;
      });

      canvas.addEventListener('mousemove', (e) => {
        if (!isDrawing) return;
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        draw(x, y);
      });

      canvas.addEventListener('mouseup', () => {
        isDrawing = false;
      });
      
      canvas.addEventListener('mouseout', () => {
        isDrawing = false;
      });
      
      // Touch support
      canvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        const rect = canvas.getBoundingClientRect();
        const touch = e.touches[0];
        lastX = touch.clientX - rect.left;
        lastY = touch.clientY - rect.top;
        isDrawing = true;
      });
      
      canvas.addEventListener('touchmove', (e) => {
        e.preventDefault();
        if (!isDrawing) return;
        const rect = canvas.getBoundingClientRect();
        const touch = e.touches[0];
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;
        draw(x, y);
      });
      
      canvas.addEventListener('touchend', (e) => {
        e.preventDefault();
        isDrawing = false;
      });
      
      // Add initial pattern
      function drawInitialPattern() {
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = 100;
        
        for (let a = 0; a < Math.PI * 2; a += 0.1) {
          const x = centerX + Math.cos(a) * radius;
          const y = centerY + Math.sin(a) * radius;
          lastX = x;
          lastY = y;
          draw(x + Math.cos(a * 5) * 20, y + Math.sin(a * 5) * 20);
        }
        
        isDrawing = false;
      }
      
      // Clear canvas
      function clearCanvas() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      
      // Animation loop
      function animate() {
        clearCanvas();
        requestAnimationFrame(animate);
      }
      
      animate();
      setTimeout(drawInitialPattern, 500);
    </script>
    `
  },
  {
    id: 'app2',
    title: '楽しいメモリーカードゲーム',
    description: 'カードをめくって同じ絵柄を見つけるクラシックなメモリーゲーム。どれだけ少ない手数でクリアできるかな？',
    creator: {
      id: 'user2',
      username: 'gamecreator',
      avatar: '/api/placeholder/50/50'
    },
    likes: 847,
    comments: 31,
    shares: 153,
    aiPrompt: 'シンプルで楽しいメモリーカードゲームを作って',
    html: `
    <div id="game-container" style="width: 100%; height: 100%; display: flex; flex-direction: column; justify-content: center; align-items: center; background-color: #1a1a2e; color: white; font-family: Arial, sans-serif;">
      <h2 style="margin-bottom: 10px;">メモリーゲーム</h2>
      <div id="stats" style="margin-bottom: 15px;">
        <span>手数: <span id="moves">0</span></span>
        <span style="margin-left: 20px;">ペア: <span id="pairs">0</span>/8</span>
      </div>
      <div id="cards-grid" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; max-width: 400px;"></div>
      <button id="restart-btn" style="margin-top: 20px; padding: 8px 16px; background-color: #4361ee; border: none; border-radius: 4px; color: white; cursor: pointer;">リスタート</button>
    </div>
    <script>
      const symbols = ['🍎', '🍌', '🍒', '🍓', '🍕', '🍩', '🍦', '🍔'];
      const cards = [...symbols, ...symbols];
      let moves = 0;
      let pairs = 0;
      let flippedCards = [];
      let lockBoard = false;
      
      const cardsGrid = document.getElementById('cards-grid');
      const movesEl = document.getElementById('moves');
      const pairsEl = document.getElementById('pairs');
      const restartBtn = document.getElementById('restart-btn');
      
      function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
      }
      
      function createCard(symbol, index) {
        const card = document.createElement('div');
        card.style.width = '80px';
        card.style.height = '80px';
        card.style.backgroundColor = '#0f3460';
        card.style.display = 'flex';
        card.style.justifyContent = 'center';
        card.style.alignItems = 'center';
        card.style.fontSize = '2rem';
        card.style.cursor = 'pointer';
        card.style.borderRadius = '8px';
        card.style.transition = 'transform 0.3s, background-color 0.3s';
        card.style.transformStyle = 'preserve-3d';
        card.dataset.symbol = symbol;
        card.dataset.index = index;
        card.addEventListener('click', flipCard);
        return card;
      }
      
      function flipCard() {
        if (lockBoard) return;
        if (this === flippedCards[0]) return;
        
        this.style.backgroundColor = '#e94560';
        this.style.transform = 'rotateY(180deg)';
        this.innerHTML = this.dataset.symbol;
        
        flippedCards.push(this);
        
        if (flippedCards.length === 2) {
          lockBoard = true;
          moves++;
          movesEl.textContent = moves;
          checkForMatch();
        }
      }
      
      function checkForMatch() {
        const [firstCard, secondCard] = flippedCards;
        const isMatch = firstCard.dataset.symbol === secondCard.dataset.symbol;
        
        if (isMatch) {
          disableCards();
          pairs++;
          pairsEl.textContent = pairs;
          if (pairs === symbols.length) {
            setTimeout(() => {
              alert('ゲームクリア！手数: ' + moves);
            }, 500);
          }
        } else {
          unflipCards();
        }
      }
      
      function disableCards() {
        flippedCards[0].removeEventListener('click', flipCard);
        flippedCards[1].removeEventListener('click', flipCard);
        resetBoard();
      }
      
      function unflipCards() {
        setTimeout(() => {
          flippedCards[0].style.backgroundColor = '#0f3460';
          flippedCards[1].style.backgroundColor = '#0f3460';
          flippedCards[0].style.transform = 'rotateY(0deg)';
          flippedCards[1].style.transform = 'rotateY(0deg)';
          flippedCards[0].innerHTML = '';
          flippedCards[1].innerHTML = '';
          resetBoard();
        }, 1000);
      }
      
      function resetBoard() {
        [flippedCards, lockBoard] = [[], false];
      }
      
      function createBoard() {
        cardsGrid.innerHTML = '';
        const shuffledCards = shuffleArray([...cards]);
        
        shuffledCards.forEach((symbol, index) => {
          const card = createCard(symbol, index);
          cardsGrid.appendChild(card);
        });
      }
      
      function restartGame() {
        moves = 0;
        pairs = 0;
        flippedCards = [];
        lockBoard = false;
        movesEl.textContent = moves;
        pairsEl.textContent = pairs;
        createBoard();
      }
      
      restartBtn.addEventListener('click', restartGame);
      
      // Initialize the game
      createBoard();
    </script>
    `
  },
  {
    id: 'app3',
    title: 'ポモドーロタイマー',
    description: '集中力を高めるポモドーロ・テクニックのためのシンプルで美しいタイマー。25分の作業と5分の休憩を自動的に切り替えます。',
    creator: {
      id: 'user3',
      username: 'productivityguru',
      avatar: '/api/placeholder/50/50'
    },
    likes: 624,
    comments: 18,
    shares: 92,
    aiPrompt: '美しいポモドーロタイマーアプリを作って',
    html: `
    <div id="pomodoro-container" style="width: 100%; height: 100%; display: flex; flex-direction: column; justify-content: center; align-items: center; background: linear-gradient(135deg, #2c3e50, #4ca1af); color: white; font-family: 'Helvetica Neue', Arial, sans-serif;">
      <div id="timer-display" style="font-size: 5rem; font-weight: 300; margin-bottom: 20px;">25:00</div>
      <div id="timer-label" style="font-size: 1.5rem; margin-bottom: 30px;">集中モード</div>
      <div id="timer-controls" style="display: flex; gap: 15px; margin-bottom: 30px;">
        <button id="start-btn" style="padding: 10px 20px; background-color: #2ecc71; border: none; border-radius: 25px; color: white; font-size: 1rem; cursor: pointer; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">スタート</button>
        <button id="pause-btn" style="padding: 10px 20px; background-color: #e74c3c; border: none; border-radius: 25px; color: white; font-size: 1rem; cursor: pointer; box-shadow: 0 4px 6px rgba(0,0,0,0.1); display: none;">一時停止</button>
        <button id="reset-btn" style="padding: 10px 20px; background-color: #3498db; border: none; border-radius: 25px; color: white; font-size: 1rem; cursor: pointer; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">リセット</button>
      </div>
      <div id="session-info" style="display: flex; flex-direction: column; align-items: center;">
        <div id="sessions-completed" style="margin-bottom: 10px;">完了したセッション: 0</div>
        <div id="session-settings" style="display: flex; gap: 20px; margin-top: 10px;">
          <div>
            <label for="work-time">作業時間 (分):</label>
            <input id="work-time" type="number" min="1" max="60" value="25" style="width: 50px; margin-left: 5px; padding: 5px; border-radius: 4px; border: none;">
          </div>
          <div>
            <label for="break-time">休憩時間 (分):</label>
            <input id="break-time" type="number" min="1" max="30" value="5" style="width: 50px; margin-left: 5px; padding: 5px; border-radius: 4px; border: none;">
          </div>
        </div>
      </div>
      <div id="progress-bar" style="width: 80%; height: 6px; background-color: rgba(255,255,255,0.2); border-radius: 3px; margin-top: 30px; overflow: hidden;">
        <div id="progress" style="width: 100%; height: 100%; background-color: #f39c12; transform-origin: left; transform: scaleX(0);"></div>
      </div>
    </div>
    <script>
      // Elements
      const timerDisplay = document.getElementById('timer-display');
      const timerLabel = document.getElementById('timer-label');
      const startBtn = document.getElementById('start-btn');
      const pauseBtn = document.getElementById('pause-btn');
      const resetBtn = document.getElementById('reset-btn');
      const sessionsCompletedEl = document.getElementById('sessions-completed');
      const workTimeInput = document.getElementById('work-time');
      const breakTimeInput = document.getElementById('break-time');
      const progressBar = document.getElementById('progress');
      
      // Variables
      let timer;
      let isRunning = false;
      let isPaused = false;
      let isBreak = false;
      let timeLeft;
      let sessionsCompleted = 0;
      let totalTime;
      let originalTime;
      
      // Audio - not actual sounds in this demo, but could be added
      const startSound = { play: () => console.log('Start sound') };
      const pauseSound = { play: () => console.log('Pause sound') };
      const completeSound = { play: () => console.log('Complete sound') };
      
      // Initialize 
      function init() {
        timeLeft = workTimeInput.value * 60;
        originalTime = timeLeft;
        totalTime = timeLeft;
        updateTimerDisplay();
      }
      
      // Update the timer display
      function updateTimerDisplay() {
        const minutes = Math.floor(timeLeft / 60).toString().padStart(2, '0');
        const seconds = (timeLeft % 60).toString().padStart(2, '0');
        timerDisplay.textContent = \`\${minutes}:\${seconds}\`;
        
        // Update progress bar
        const progress = 1 - (timeLeft / originalTime);
        progressBar.style.transform = \`scaleX(\${progress})\`;
      }
      
      // Start the timer
      function startTimer() {
        if (isRunning && !isPaused) return;
        
        if (!isRunning) {
          isRunning = true;
          startSound.play();
          
          // Hide start button, show pause button
          startBtn.style.display = 'none';
          pauseBtn.style.display = 'inline-block';
          
          // Disable inputs while timer is running
          workTimeInput.disabled = true;
          breakTimeInput.disabled = true;
        }
        
        isPaused = false;
        pauseBtn.textContent = '一時停止';
        
        timer = setInterval(() => {
          timeLeft--;
          updateTimerDisplay();
          
          if (timeLeft <= 0) {
            clearInterval(timer);
            completeSound.play();
            
            if (!isBreak) {
              // Switch to break
              isBreak = true;
              sessionsCompleted++;
              sessionsCompletedEl.textContent = \`完了したセッション: \${sessionsCompleted}\`;
              timeLeft = breakTimeInput.value * 60;
              originalTime = timeLeft;
              timerLabel.textContent = '休憩モード';
              progressBar.style.backgroundColor = '#3498db';
              startTimer();
            } else {
              // Switch to work
              isBreak = false;
              timeLeft = workTimeInput.value * 60;
              originalTime = timeLeft;
              timerLabel.textContent = '集中モード';
              progressBar.style.backgroundColor = '#f39c12';
              startTimer();
            }
          }
        }, 1000);
      }
      
      // Pause the timer
      function pauseTimer() {
        if (!isRunning) return;
        
        if (!isPaused) {
          clearInterval(timer);
          isPaused = true;
          pauseSound.play();
          pauseBtn.textContent = '再開';
        } else {
          startTimer();
        }
      }
      
      // Reset the timer
      function resetTimer() {
        clearInterval(timer);
        isRunning = false;
        isPaused = false;
        isBreak = false;
        
        // Reset UI
        startBtn.style.display = 'inline-block';
        pauseBtn.style.display = 'none';
        timerLabel.textContent = '集中モード';
        workTimeInput.disabled = false;
        breakTimeInput.disabled = false;
        progressBar.style.backgroundColor = '#f39c12';
        
        // Reset time
        init();
      }
      
      // Event listeners
      startBtn.addEventListener('click', startTimer);
      pauseBtn.addEventListener('click', pauseTimer);
      resetBtn.addEventListener('click', resetTimer);
      workTimeInput.addEventListener('change', init);
      breakTimeInput.addEventListener('change', () => {
        if (!isRunning || isPaused) {
          init();
        }
      });
      
      // Initialize the app
      init();
    </script>
    `
  },
  {
    id: 'app4',
    title: 'ピクセルアートドローイング',
    description: 'カラーパレットから色を選んでクールなピクセルアートを作成できます。作品を保存して共有することもできます！',
    creator: {
      id: 'user4',
      username: 'pixelartist',
      avatar: '/api/placeholder/50/50'
    },
    likes: 1823,
    comments: 64,
    shares: 215,
    aiPrompt: 'シンプルなピクセルアートエディタを作って',
    html: `
    <div id="pixel-art-app" style="width: 100%; height: 100%; display: flex; flex-direction: column; padding: 20px; background-color: #2d3436; color: white; font-family: Arial, sans-serif;">
      <h2 style="margin-bottom: 15px; text-align: center;">ピクセルアートメーカー</h2>
      
      <div style="display: flex; gap: 20px; height: calc(100% - 80px);">
        <!-- Tools Panel -->
        <div style="display: flex; flex-direction: column; gap: 15px; min-width: 150px;">
          <!-- Color Palette -->
          <div>
            <h3 style="margin-bottom: 10px; font-size: 1rem;">カラーパレット</h3>
            <div id="color-palette" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 5px;"></div>
            <input type="color" id="custom-color" style="width: 100%; margin-top: 10px;">
          </div>
          
          <!-- Tools -->
          <div>
            <h3 style="margin-bottom: 10px; font-size: 1rem;">ツール</h3>
            <div style="display: flex; flex-direction: column; gap: 8px;">
              <button id="pencil-tool" class="tool-btn active" style="padding: 8px; background-color: #3498db; border: none; border-radius: 4px; color: white; cursor: pointer;">ペンシル</button>
              <button id="eraser-tool" class="tool-btn" style="padding: 8px; background-color: #7f8c8d; border: none; border-radius: 4px; color: white; cursor: pointer;">消しゴム</button>
              <button id="fill-tool" class="tool-btn" style="padding: 8px; background-color: #7f8c8d; border: none; border-radius: 4px; color: white; cursor: pointer;">塗りつぶし</button>
            </div>
          </div>
          
          <!-- Actions -->
          <div>
            <h3 style="margin-bottom: 10px; font-size: 1rem;">アクション</h3>
            <div style="display: flex; flex-direction: column; gap: 8px;">
              <button id="clear-btn" style="padding: 8px; background-color: #e74c3c; border: none; border-radius: 4px; color: white; cursor: pointer;">クリア</button>
              <button id="save-btn" style="padding: 8px; background-color: #2ecc71; border: none; border-radius: 4px; color: white; cursor: pointer;">保存する</button>
            </div>
          </div>
          
          <div>
            <h3 style="margin-bottom: 10px; font-size: 1rem;">グリッドサイズ</h3>
            <select id="grid-size" style="width: 100%; padding: 8px; background-color: #34495e; color: white; border: none; border-radius: 4px;">
              <option value="16">16 x 16</option>
              <option value="32" selected>32 x 32</option>
              <option value="48">48 x 48</option>
              <option value="64">64 x 64</option>
            </select>
          </div>
        </div>
        
        <!-- Canvas Container -->
        <div style="flex: 1; display: flex; justify-content: center; align-items: center; background-color: #34495e; border-radius: 8px; overflow: hidden;">
          <div id="canvas-container" style="position: relative; width: 384px; height: 384px; overflow: hidden;">
            <div id="pixel-grid" style="display: grid; width: 100%; height: 100%; background-color: white;"></div>
          </div>
        </div>
      </div>
    </div>
    <script>
      // Elements
      const pixelGrid = document.getElementById('pixel-grid');
      const colorPalette = document.getElementById('color-palette');
      const customColorInput = document.getElementById('custom-color');
      const pencilTool = document.getElementById('pencil-tool');
      const eraserTool = document.getElementById('eraser-tool');
      const fillTool = document.getElementById('fill-tool');
      const clearBtn = document.getElementById('clear-btn');
      const saveBtn = document.getElementById('save-btn');
      const gridSizeSelect = document.getElementById('grid-size');
      
      // Variables
      let currentColor = '#000000';
      let currentTool = 'pencil';
      let isDrawing = false;
      let gridSize = parseInt(gridSizeSelect.value);
      let pixelData = Array(gridSize * gridSize).fill('#FFFFFF');
      
      // Color palette
      const colors = [
        '#000000', '#FFFFFF', '#FF0000', '#00FF00', 
        '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF',
        '#FFA500', '#800080', '#008000', '#800000',
        '#808080', '#C0C0C0', '#FFC0CB', '#A52A2A'
      ];
      
      // Initialize color palette
      function initColorPalette() {
        colorPalette.innerHTML = '';
        colors.forEach(color => {
          const colorBtn = document.createElement('div');
          colorBtn.style.width = '25px';
          colorBtn.style.height = '25px';
          colorBtn.style.backgroundColor = color;
          colorBtn.style.cursor = 'pointer';
          colorBtn.style.border = color === currentColor ? '2px solid white' : '1px solid #333';
          
          colorBtn.addEventListener('click', () => {
            currentColor = color;
            updateSelectedColor();
            if (currentTool === 'eraser') {
              setCurrentTool('pencil');
            }
          });
          
          colorPalette.appendChild(colorBtn);
        });
        
        customColorInput.value = currentColor;
      }
      
      // Create pixel grid
      function createPixelGrid() {
        pixelGrid.innerHTML = '';
        pixelGrid.style.gridTemplateColumns = \`repeat(\${gridSize}, 1fr)\`;
        pixelGrid.style.gridTemplateRows = \`repeat(\${gridSize}, 1fr)\`;
        
        for (let i = 0; i < gridSize * gridSize; i++) {
          const pixel = document.createElement('div');
          pixel.style.backgroundColor = pixelData[i];
          pixel.style.border = '1px solid #eee';
          pixel.dataset.index = i;
          
          // Mouse events
          pixel.addEventListener('mousedown', (e) => {
            isDrawing = true;
            applyTool(pixel);
          });
          
          pixel.addEventListener('mouseover', (e) => {
            if (isDrawing) {
              applyTool(pixel);
            }
          });
          
          // Touch events
          pixel.addEventListener('touchstart', (e) => {
            e.preventDefault();
            isDrawing = true;
            applyTool(pixel);
          });
          
          pixel.addEventListener('touchmove', (e) => {
            e.preventDefault();
            if (isDrawing) {
              // Get touch position and find element at that position
              const touch = e.touches[0];
              const element = document.elementFromPoint(touch.clientX, touch.clientY);
              if (element && element.dataset.index) {
                applyTool(element);
              }
            }
          });
          
          pixelGrid.appendChild(pixel);
        }
      }
      
      // Apply the current tool to a pixel
      function applyTool(pixel) {
        const index = parseInt(pixel.dataset.index);
        
        switch (currentTool) {
          case 'pencil':
            pixel.style.backgroundColor = currentColor;
            pixelData[index] = currentColor;
            break;
            
          case 'eraser':
            pixel.style.backgroundColor = '#FFFFFF';
            pixelData[index] = '#FFFFFF';
            break;
            
          case 'fill':
            const targetColor = pixelData[index];
            if (targetColor === currentColor) return;
            
            // Flood fill algorithm
            const stack = [index];
            const visited = new Set();
            
            while (stack.length > 0) {
              const currentIndex = stack.pop();
              if (visited.has(currentIndex)) continue;
              
              visited.add(currentIndex);
              if (pixelData[currentIndex] !== targetColor) continue;
              
              pixelData[currentIndex] = currentColor;
              pixelGrid.children[currentIndex].style.backgroundColor = currentColor;
              
              // Calculate row and column
              const row = Math.floor(currentIndex / gridSize);
              const col = currentIndex % gridSize;
              
              // Check adjacent pixels (up, right, down, left)
              if (row > 0) stack.push(currentIndex - gridSize); // up
              if (col < gridSize - 1) stack.push(currentIndex + 1); // right
              if (row < gridSize - 1) stack.push(currentIndex + gridSize); // down
              if (col > 0) stack.push(currentIndex - 1); // left
            }
            break;
        }
      }
      
      // Update tool buttons to show which is selected
      function updateToolButtons() {
        const toolBtns = document.querySelectorAll('.tool-btn');
        toolBtns.forEach(btn => {
          btn.classList.remove('active');
          btn.style.backgroundColor = '#7f8c8d';
        });
        
        switch (currentTool) {
          case 'pencil':
            pencilTool.classList.add('active');
            pencilTool.style.backgroundColor = '#3498db';
            break;
          case 'eraser':
            eraserTool.classList.add('active');
            eraserTool.style.backgroundColor = '#3498db';
            break;
          case 'fill':
            fillTool.classList.add('active');
            fillTool.style.backgroundColor = '#3498db';
            break;
        }
      }
      
      // Set the current tool
      function setCurrentTool(tool) {
        currentTool = tool;
        updateToolButtons();
      }
      
      // Update selected color
      function updateSelectedColor() {
        const colorBtns = colorPalette.querySelectorAll('div');
        colorBtns.forEach(btn => {
          btn.style.border = btn.style.backgroundColor === currentColor ? '2px solid white' : '1px solid #333';
        });
        
        customColorInput.value = currentColor;
      }
      
      // Clear the canvas
      function clearCanvas() {
        pixelData = Array(gridSize * gridSize).fill('#FFFFFF');
        Array.from(pixelGrid.children).forEach(pixel => {
          pixel.style.backgroundColor = '#FFFFFF';
        });
      }
      
      // Save the artwork
      function saveArtwork() {
        // Create a canvas element to render the pixel art
        const canvas = document.createElement('canvas');
        canvas.width = gridSize;
        canvas.height = gridSize;
        const ctx = canvas.getContext('2d');
        
        // Draw each pixel
        for (let i = 0; i < pixelData.length; i++) {
          const row = Math.floor(i / gridSize);
          const col = i % gridSize;
          
          ctx.fillStyle = pixelData[i];
          ctx.fillRect(col, row, 1, 1);
        }
        
        // Convert to data URL and create download link
        try {
          const dataUrl = canvas.toDataURL('image/png');
          const link = document.createElement('a');
          link.download = 'pixel-art.png';
          link.href = dataUrl;
          link.click();
        } catch (err) {
          console.error('Error saving image:', err);
          alert('保存中にエラーが発生しました。');
        }
      }
      
      // Event listeners
      document.addEventListener('mouseup', () => {
        isDrawing = false;
      });
      
      document.addEventListener('touchend', () => {
        isDrawing = false;
      });
      
      pencilTool.addEventListener('click', () => setCurrentTool('pencil'));
      eraserTool.addEventListener('click', () => setCurrentTool('eraser'));
      fillTool.addEventListener('click', () => setCurrentTool('fill'));
      clearBtn.addEventListener('click', clearCanvas);
      saveBtn.addEventListener('click', saveArtwork);
      
      customColorInput.addEventListener('input', (e) => {
        currentColor = e.target.value;
        if (currentTool === 'eraser') {
          setCurrentTool('pencil');
        }
        initColorPalette(); // Redraw to update the selected indicator
      });
      
      gridSizeSelect.addEventListener('change', (e) => {
        if (confirm('グリッドサイズを変更すると現在の作品は消去されます。よろしいですか？')) {
          gridSize = parseInt(e.target.value);
          pixelData = Array(gridSize * gridSize).fill('#FFFFFF');
          createPixelGrid();
        } else {
          gridSizeSelect.value = gridSize.toString();
        }
      });
      
      // Initialize
      initColorPalette();
      createPixelGrid();
      updateToolButtons();
    </script>
    `
  },
  {
    id: 'app5',
    title: '音楽ビートメーカー',
    description: 'シンプルな16ステップのビートシーケンサーで音楽を作成。ドラム、ベース、シンセを組み合わせてあなただけのビートを作ろう！',
    creator: {
      id: 'user5',
      username: 'beatproducer',
      avatar: '/api/placeholder/50/50'
    },
    likes: 973,
    comments: 47,
    shares: 184,
    aiPrompt: 'シンプルなビートメーカーアプリを作成して',
    html: `
    <div id="beat-maker" style="width: 100%; height: 100%; display: flex; flex-direction: column; background-color: #121212; color: white; font-family: 'Roboto', Arial, sans-serif; padding: 20px;">
      <h2 style="text-align: center; margin-bottom: 20px; color: #1DB954;">ビートメーカー</h2>
      
      <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
        <div>
          <button id="play-btn" style="padding: 10px 20px; background-color: #1DB954; border: none; border-radius: 20px; color: white; font-weight: bold; cursor: pointer;">再生</button>
          <button id="stop-btn" style="padding: 10px 20px; background-color: #333; border: none; border-radius: 20px; color: white; font-weight: bold; cursor: pointer; margin-left: 10px;">停止</button>
        </div>
        <div>
          <label for="tempo" style="margin-right: 10px;">テンポ: <span id="tempo-value">120</span> BPM</label>
          <input type="range" id="tempo" min="60" max="180" value="120" style="width: 150px;">
        </div>
      </div>
      
      <div id="sequencer" style="flex: 1; display: flex; flex-direction: column; gap: 15px; overflow-y: auto;">
        <!-- Kick Drum -->
        <div class="track" style="display: flex; align-items: center;">
          <div style="width: 100px; display: flex; align-items: center;">
            <span style="margin-right: 10px;">キック</span>
            <input type="range" class="volume" min="0" max="100" value="80" style="width: 60px;">
          </div>
          <div class="steps" style="display: grid; grid-template-columns: repeat(16, 1fr); flex: 1; gap: 5px;"></div>
        </div>
        
        <!-- Snare -->
        <div class="track" style="display: flex; align-items: center;">
          <div style="width: 100px; display: flex; align-items: center;">
            <span style="margin-right: 10px;">スネア</span>
            <input type="range" class="volume" min="0" max="100" value="70" style="width: 60px;">
          </div>
          <div class="steps" style="display: grid; grid-template-columns: repeat(16, 1fr); flex: 1; gap: 5px;"></div>
        </div>
        
        <!-- Hi-hat -->
        <div class="track" style="display: flex; align-items: center;">
          <div style="width: 100px; display: flex; align-items: center;">
            <span style="margin-right: 10px;">ハイハット</span>
            <input type="range" class="volume" min="0" max="100" value="60" style="width: 60px;">
          </div>
          <div class="steps" style="display: grid; grid-template-columns: repeat(16, 1fr); flex: 1; gap: 5px;"></div>
        </div>
        
        <!-- Bass -->
        <div class="track" style="display: flex; align-items: center;">
          <div style="width: 100px; display: flex; align-items: center;">
            <span style="margin-right: 10px;">ベース</span>
            <input type="range" class="volume" min="0" max="100" value="75" style="width: 60px;">
          </div>
          <div class="steps" style="display: grid; grid-template-columns: repeat(16, 1fr); flex: 1; gap: 5px;"></div>
        </div>
        
        <!-- Synth -->
        <div class="track" style="display: flex; align-items: center;">
          <div style="width: 100px; display: flex; align-items: center;">
            <span style="margin-right: 10px;">シンセ</span>
            <input type="range" class="volume" min="0" max="100" value="65" style="width: 60px;">
          </div>
          <div class="steps" style="display: grid; grid-template-columns: repeat(16, 1fr); flex: 1; gap: 5px;"></div>
        </div>
      </div>
      
      <div style="margin-top: 20px; display: flex; justify-content: center; gap: 15px;">
        <button id="clear-btn" style="padding: 8px 15px; background-color: #333; border: none; border-radius: 4px; color: white; cursor: pointer;">クリア</button>
        <button id="random-btn" style="padding: 8px 15px; background-color: #9C27B0; border: none; border-radius: 4px; color: white; cursor: pointer;">ランダム</button>
        <div style="display: flex; align-items: center;">
          <label for="pattern-select" style="margin-right: 5px;">パターン:</label>
          <select id="pattern-select" style="padding: 8px; background-color: #333; color: white; border: none; border-radius: 4px;">
            <option value="0">パターン 1</option>
            <option value="1">パターン 2</option>
            <option value="2">パターン 3</option>
            <option value="3">パターン 4</option>
          </select>
        </div>
      </div>
    </div>
    <script>
      // Web Audio API context
      let audioContext;
      
      // Init tracking
      let isPlaying = false;
      let currentStep = 0;
      let intervalId;
      let tempo = 120;
      let currentPattern = 0;
      
      // Patterns storage
      const patterns = [
        Array(5).fill().map(() => Array(16).fill(false)), // Pattern 1
        Array(5).fill().map(() => Array(16).fill(false)), // Pattern 2
        Array(5).fill().map(() => Array(16).fill(false)), // Pattern 3
        Array(5).fill().map(() => Array(16).fill(false))  // Pattern 4
      ];
      
      // Default patterns
      patterns[0][0][0] = true; // Kick on first beat
      patterns[0][0][8] = true; // Kick on third beat
      patterns[0][1][4] = true; // Snare on second beat
      patterns[0][1][12] = true; // Snare on fourth beat
      patterns[0][2][2] = true; // Hi-hat
      patterns[0][2][6] = true;
      patterns[0][2][10] = true;
      patterns[0][2][14] = true;
      
      // Elements
      const playBtn = document.getElementById('play-btn');
      const stopBtn = document.getElementById('stop-btn');
      const tempoSlider = document.getElementById('tempo');
      const tempoValue = document.getElementById('tempo-value');
      const tracks = document.querySelectorAll('.track');
      const clearBtn = document.getElementById('clear-btn');
      const randomBtn = document.getElementById('random-btn');
      const patternSelect = document.getElementById('pattern-select');
      
      // Initialize sequencer UI
      function initSequencer() {
        tracks.forEach((track, trackIndex) => {
          const stepsContainer = track.querySelector('.steps');
          stepsContainer.innerHTML = '';
          
          for (let i = 0; i < 16; i++) {
            const step = document.createElement('div');
            step.className = 'step';
            step.style.height = '30px';
            step.style.backgroundColor = (i % 4 === 0) ? '#333' : '#222';
            step.style.border = '1px solid #444';
            step.style.borderRadius = '4px';
            step.style.cursor = 'pointer';
            
            // Set active state based on pattern
            if (patterns[currentPattern][trackIndex][i]) {
              step.classList.add('active');
              step.style.backgroundColor = getTrackColor(trackIndex);
            }
            
            step.dataset.step = i;
            step.dataset.track = trackIndex;
            
            step.addEventListener('click', () => {
              toggleStep(step, trackIndex, i);
            });
            
            stepsContainer.appendChild(step);
          }
        });
      }
      
      // Toggle step active state
      function toggleStep(step, trackIndex, stepIndex) {
        const isActive = step.classList.contains('active');
        
        if (isActive) {
          step.classList.remove('active');
          step.style.backgroundColor = (stepIndex % 4 === 0) ? '#333' : '#222';
          patterns[currentPattern][trackIndex][stepIndex] = false;
        } else {
          step.classList.add('active');
          step.style.backgroundColor = getTrackColor(trackIndex);
          patterns[currentPattern][trackIndex][stepIndex] = true;
        }
      }
      
      // Get color for each track
      function getTrackColor(trackIndex) {
        const colors = ['#1DB954', '#FF5722', '#03A9F4', '#FFC107', '#9C27B0'];
        return colors[trackIndex % colors.length];
      }
      
      // Init Web Audio
      function initAudio() {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
      }
      
      // Play a sound
      function playSound(trackIndex, volume) {
        if (!audioContext) return;
        
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        // Normalize volume
        const normalizedVolume = volume / 100;
        gainNode.gain.value = normalizedVolume * 0.3; // Keep it quieter
        
        // Different sound for each track
        switch (trackIndex) {
          case 0: // Kick
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(150, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(40, audioContext.currentTime + 0.1);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
            oscillator.start();
            oscillator.stop(audioContext.currentTime + 0.3);
            break;
            
          case 1: // Snare
            oscillator.type = 'triangle';
            oscillator.frequency.setValueAtTime(250, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
            
            // Add noise for snare
            const noiseNode = audioContext.createBufferSource();
            const bufferSize = audioContext.sampleRate * 0.1; // 100ms of noise
            const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
            const output = buffer.getChannelData(0);
            
            for (let i = 0; i < bufferSize; i++) {
              output[i] = Math.random() * 2 - 1;
            }
            
            noiseNode.buffer = buffer;
            
            const noiseGain = audioContext.createGain();
            noiseGain.gain.value = normalizedVolume * 0.15;
            noiseGain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
            
            noiseNode.connect(noiseGain);
            noiseGain.connect(audioContext.destination);
            
            noiseNode.start();
            oscillator.start();
            oscillator.stop(audioContext.currentTime + 0.1);
            break;
            
          case 2: // Hi-hat
            oscillator.type = 'square';
            oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05);
            oscillator.start();
            oscillator.stop(audioContext.currentTime + 0.05);
            break;
            
          case 3: // Bass
            oscillator.type = 'triangle';
            oscillator.frequency.setValueAtTime(60, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
            oscillator.start();
            oscillator.stop(audioContext.currentTime + 0.2);
            break;
            
          case 4: // Synth
            oscillator.type = 'sine';
            
            // Simple melody
            const notes = [392, 440, 349.23, 523.25]; // G4, A4, F4, C5
            const noteIndex = currentStep % 4;
            oscillator.frequency.setValueAtTime(notes[noteIndex], audioContext.currentTime);
            
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
            oscillator.start();
            oscillator.stop(audioContext.currentTime + 0.2);
            break;
        }
      }
      
      // Start the sequencer
      function startSequencer() {
        if (!audioContext) {
          initAudio();
        }
        
        const stepTime = 60000 / tempo / 4; // 16th notes
        
        if (intervalId) {
          clearInterval(intervalId);
        }
        
        isPlaying = true;
        playBtn.style.backgroundColor = '#333';
        stopBtn.style.backgroundColor = '#e74c3c';
        
        // Reset and start
        currentStep = 0;
        
        intervalId = setInterval(() => {
          // Highlight current step
          document.querySelectorAll('.step').forEach((step, index) => {
            const stepIndex = parseInt(step.dataset.step);
            if (stepIndex === currentStep) {
              step.style.opacity = '0.7';
            } else {
              step.style.opacity = '1';
            }
          });
          
          // Play sounds for current step
          tracks.forEach((track, trackIndex) => {
            if (patterns[currentPattern][trackIndex][currentStep]) {
              const volume = track.querySelector('.volume').value;
              playSound(trackIndex, volume);
            }
          });
          
          // Increment step
          currentStep = (currentStep + 1) % 16;
        }, stepTime);
      }
      
      // Stop the sequencer
      function stopSequencer() {
        clearInterval(intervalId);
        intervalId = null;
        isPlaying = false;
        
        playBtn.style.backgroundColor = '#1DB954';
        stopBtn.style.backgroundColor = '#333';
        
        // Clear step highlights
        document.querySelectorAll('.step').forEach(step => {
          step.style.opacity = '1';
        });
      }
      
      // Clear all steps
      function clearSteps() {
        patterns[currentPattern] = Array(5).fill().map(() => Array(16).fill(false));
        initSequencer();
      }
      
      // Generate a random pattern
      function generateRandomPattern() {
        patterns[currentPattern] = Array(5).fill().map(() => {
          return Array(16).fill().map(() => Math.random() > 0.8);
        });
        
        // Make kick and snare more rhythmic
        for (let i = 0; i < 16; i += 4) {
          patterns[currentPattern][0][i] = Math.random() > 0.3; // Kick on main beats
        }
        
        for (let i = 4; i < 16; i += 8) {
          patterns[currentPattern][1][i] = Math.random() > 0.3; // Snare on 2 and 4
        }
        
        initSequencer();
      }
      
      // Change pattern
      function changePattern(newPattern) {
        currentPattern = newPattern;
        initSequencer();
      }
      
      // Event listeners
      playBtn.addEventListener('click', () => {
        if (!isPlaying) {
          startSequencer();
        }
      });
      
      stopBtn.addEventListener('click', () => {
        if (isPlaying) {
          stopSequencer();
        }
      });
      
      tempoSlider.addEventListener('input', (e) => {
        tempo = parseInt(e.target.value);
        tempoValue.textContent = tempo;
        
        if (isPlaying) {
          stopSequencer();
          startSequencer();
        }
      });
      
      clearBtn.addEventListener('click', clearSteps);
      randomBtn.addEventListener('click', generateRandomPattern);
      
      patternSelect.addEventListener('change', (e) => {
        changePattern(parseInt(e.target.value));
      });
      
      // Initialize
      initSequencer();
    </script>
    `
  }
];

// AppTok プラットフォームメインコンポーネント
const AppTokPlatform = () => {
  // 状態
  const [currentUser, setCurrentUser] = useState({
    id: 'user123',
    username: 'ai_enthusiast',
    avatar: '/api/placeholder/50/50',
    bio: 'AIとインタラクティブアプリが好き'
  });
  
  const [apps, setApps] = useState(SAMPLE_APPS);
  const [currentAppIndex, setCurrentAppIndex] = useState(0);
  const [activeSection, setActiveSection] = useState('feed');
  const [isAppRunning, setIsAppRunning] = useState(false);
  const [isAIPromptOpen, setIsAIPromptOpen] = useState(false);
  const [aiPrompt, setAIPrompt] = useState('');
  const [aiLoading, setAILoading] = useState(false);
  
  const appContainerRef = useRef<HTMLDivElement>(null);
  const feedContainerRef = useRef<HTMLDivElement>(null);
  
  const currentApp = apps[currentAppIndex];
  
  // アプリの表示状態を切り替える
  const toggleAppRunning = () => {
    setIsAppRunning(!isAppRunning);
  };
  
  // 次のアプリに移動
  const goToNextApp = () => {
    if (isAppRunning) {
      setIsAppRunning(false);
      setTimeout(() => {
        setCurrentAppIndex((prevIndex) => (prevIndex + 1) % apps.length);
        setIsAppRunning(true);
      }, 300);
    } else {
      setCurrentAppIndex((prevIndex) => (prevIndex + 1) % apps.length);
    }
  };
  
  // 前のアプリに移動
  const goToPrevApp = () => {
    if (isAppRunning) {
      setIsAppRunning(false);
      setTimeout(() => {
        setCurrentAppIndex((prevIndex) => (prevIndex - 1 + apps.length) % apps.length);
        setIsAppRunning(true);
      }, 300);
    } else {
      setCurrentAppIndex((prevIndex) => (prevIndex - 1 + apps.length) % apps.length);
    }
  };
  
  // いいねの処理
  const handleLike = () => {
    setApps(apps.map((app, index) => {
      if (index === currentAppIndex) {
        return { ...app, likes: app.likes + 1 };
      }
      return app;
    }));
  };
  
  // アプリの共有
  const handleShare = () => {
    setApps(apps.map((app, index) => {
      if (index === currentAppIndex) {
        return { ...app, shares: app.shares + 1 };
      }
      return app;
    }));
    
    alert(`「${currentApp.title}」を共有しました！`);
  };
  
  // AIに新しいアプリを作成させる
  const createAppWithAI = () => {
    if (!aiPrompt.trim()) return;
    
    setAILoading(true);
    
    // 実際のプロダクトではAI APIを呼び出す
    setTimeout(() => {
      // 仮のレスポンス - 実際にはAIがHTMLを生成
      const newApp = {
        id: `app${apps.length + 1}`,
        title: aiPrompt,
        description: `AIが生成したアプリ: ${aiPrompt}`,
        creator: currentUser,
        likes: 0,
        comments: 0,
        shares: 0,
        aiPrompt: aiPrompt,
        html: `
        <div style="width: 100%; height: 100%; display: flex; justify-content: center; align-items: center; background-color: #f5f5f5; font-family: Arial, sans-serif;">
          <div style="text-align: center; padding: 20px;">
            <h2 style="color: #333;">${aiPrompt}</h2>
            <p>AIによって生成されたアプリ</p>
            <div style="margin: 20px 0;">
              <button id="demo-btn" style="padding: 10px 20px; background-color: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer;">デモ動作</button>
            </div>
            <div id="output" style="margin-top: 20px; padding: 15px; background-color: #fff; border-radius: 4px; min-height: 100px;"></div>
          </div>
        </div>
        <script>
          const demoBtn = document.getElementById('demo-btn');
          const output = document.getElementById('output');
          
          demoBtn.addEventListener('click', () => {
            output.innerHTML = 'AIによって生成されたデモコンテンツ！<br>実際のプロダクトではより高機能なアプリが生成されます。';
            
            // 簡単なアニメーション
            let opacity = 0;
            output.style.opacity = opacity;
            
            const fadeIn = setInterval(() => {
              opacity += 0.1;
              output.style.opacity = opacity;
              
              if (opacity >= 1) {
                clearInterval(fadeIn);
              }
            }, 50);
          });
        </script>
        `
      };
      
      setApps([newApp, ...apps]);
      setCurrentAppIndex(0);
      setAILoading(false);
      setIsAIPromptOpen(false);
      setAIPrompt('');
      setIsAppRunning(true);
    }, 2000); // 2秒後に「生成完了」
  };
  
  useEffect(() => {
    const handleScroll = (e: WheelEvent) => {
      if (activeSection === 'feed' && feedContainerRef.current) {
        const delta = e.deltaY;
        if (delta > 0) {
          goToNextApp();
        } else if (delta < 0) {
          goToPrevApp();
        }
      }
    };
    
    window.addEventListener('wheel', handleScroll);
    return () => {
      window.removeEventListener('wheel', handleScroll);
    };
  }, [activeSection, currentAppIndex, isAppRunning]);
  
  // キーボードナビゲーション
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeSection === 'feed') {
        if (e.key === 'ArrowDown' || e.key === 'j') {
          goToNextApp();
        } else if (e.key === 'ArrowUp' || e.key === 'k') {
          goToPrevApp();
        } else if (e.key === 'Enter' || e.key === ' ') {
          toggleAppRunning();
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeSection, currentAppIndex, isAppRunning]);
  
    // アプリのiframeでのレンダリング
    useEffect(() => {
      if (appContainerRef.current && isAppRunning) {
        // iframeをクリアして新しいコンテンツを挿入
        const iframe = document.createElement('iframe');
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.style.border = 'none';
        iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin');
        
        if (appContainerRef.current) {
          appContainerRef.current.innerHTML = '';
          appContainerRef.current.appendChild(iframe);
        }
        
        // iframeのコンテンツを設定
        setTimeout(() => {
          const contentWindow = iframe.contentWindow;
          if (contentWindow) {
            const doc = iframe.contentDocument || contentWindow.document;
            doc.open();
            doc.write(currentApp.html);
            doc.close();
          }
        }, 0);
      }
    }, [currentApp, isAppRunning]);
  
  
  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      {/* ヘッダー */}
      <header className="bg-black py-3 px-4 flex items-center justify-between border-b border-gray-800">
        <div className="flex items-center">
          <Sparkles className="h-6 w-6 text-purple-500" />
          <h1 className="ml-2 text-xl font-bold text-white">AppTok</h1>
        </div>
        
        <div className="relative">
          <input
            type="text"
            placeholder="アプリを検索..."
            className="py-2 px-4 pl-10 bg-gray-800 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 w-64"
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        </div>
        
        <div className="flex items-center">
          <img
            src={currentUser.avatar}
            alt="ユーザープロフィール"
            className="w-8 h-8 rounded-full"
          />
          <span className="ml-2 text-sm font-medium">{currentUser.username}</span>
        </div>
      </header>
      
      {/* メインコンテンツ */}
      <div className="flex flex-1 overflow-hidden">
        {/* サイドバー */}
        <nav className="w-16 bg-black flex flex-col items-center py-4 border-r border-gray-800">
          <button
            onClick={() => setActiveSection('feed')}
            className={`p-3 rounded-full mb-4 ${activeSection === 'feed' ? 'bg-purple-500 text-white' : 'text-gray-400 hover:bg-gray-800'}`}
          >
            <Home className="h-6 w-6" />
          </button>
          <button
            onClick={() => setActiveSection('discover')}
            className={`p-3 rounded-full mb-4 ${activeSection === 'discover' ? 'bg-purple-500 text-white' : 'text-gray-400 hover:bg-gray-800'}`}
          >
            <Compass className="h-6 w-6" />
          </button>
          <button
            onClick={() => setIsAIPromptOpen(true)}
            className="p-3 rounded-full mb-4 text-gray-400 hover:bg-gray-800"
          >
            <PlusSquare className="h-6 w-6" />
          </button>
          <button
            onClick={() => setActiveSection('notifications')}
            className={`p-3 rounded-full mb-4 ${activeSection === 'notifications' ? 'bg-purple-500 text-white' : 'text-gray-400 hover:bg-gray-800'}`}
          >
            <Bell className="h-6 w-6" />
          </button>
          <button
            onClick={() => setActiveSection('profile')}
            className={`p-3 rounded-full ${activeSection === 'profile' ? 'bg-purple-500 text-white' : 'text-gray-400 hover:bg-gray-800'}`}
          >
            <User className="h-6 w-6" />
          </button>
        </nav>
        
        {/* フィードセクション */}
        {activeSection === 'feed' && (
          <div 
            ref={feedContainerRef}
            className="flex-1 flex flex-col items-center"
          >
            <div className="relative w-full max-w-lg flex-1 flex flex-col border-l border-r border-gray-800">
              {/* アプリ表示エリア */}
              <div className="flex-1 relative overflow-hidden bg-gray-900">
                <div 
                  ref={appContainerRef}
                  className={`absolute inset-0 transition-opacity duration-300 ${isAppRunning ? 'opacity-100' : 'opacity-0'}`}
                ></div>
                
                {!isAppRunning && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                    <h2 className="text-2xl font-bold mb-2">{currentApp.title}</h2>
                    <p className="text-gray-400 mb-6">{currentApp.description}</p>
                    <p className="text-sm text-gray-500 mb-2">AIプロンプト: "{currentApp.aiPrompt}"</p>
                    <button
                      onClick={toggleAppRunning}
                      className="px-6 py-3 bg-purple-600 rounded-full font-medium flex items-center hover:bg-purple-700 transition"
                    >
                      <Play className="mr-2 h-5 w-5" />
                      アプリを実行
                    </button>
                  </div>
                )}
                
                {/* コントロールボタン */}
                <div className="absolute bottom-4 right-4 flex flex-col items-center">
                  {isAppRunning && (
                    <button
                      onClick={toggleAppRunning}
                      className="mb-4 p-3 bg-gray-800 rounded-full hover:bg-gray-700"
                    >
                      <Pause className="h-6 w-6" />
                    </button>
                  )}
                  <button
                    onClick={handleLike}
                    className="mb-4 p-3 bg-gray-800 rounded-full hover:bg-gray-700"
                  >
                    <Heart className={`h-6 w-6 ${currentApp.likes > 0 ? 'text-red-500' : 'text-white'}`} />
                  </button>
                  <div className="mb-4 text-center">
                    <span className="text-sm font-medium">{currentApp.likes}</span>
                  </div>
                  <button
                    onClick={() => alert(`コメント (${currentApp.comments})`)}
                    className="mb-4 p-3 bg-gray-800 rounded-full hover:bg-gray-700"
                  >
                    <MessageSquare className="h-6 w-6" />
                  </button>
                  <div className="mb-4 text-center">
                    <span className="text-sm font-medium">{currentApp.comments}</span>
                  </div>
                  <button
                    onClick={handleShare}
                    className="mb-4 p-3 bg-gray-800 rounded-full hover:bg-gray-700"
                  >
                    <Share2 className="h-6 w-6" />
                  </button>
                  <div className="mb-4 text-center">
                    <span className="text-sm font-medium">{currentApp.shares}</span>
                  </div>
                  <button
                    onClick={() => alert('ソースコードを保存しました！')}
                    className="p-3 bg-gray-800 rounded-full hover:bg-gray-700"
                    title="ソースコードを保存"
                  >
                    <Code className="h-6 w-6" />
                  </button>
                </div>
                
                {/* ナビゲーションボタン */}
                <button
                  onClick={goToPrevApp}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-gray-800 rounded-full hover:bg-gray-700"
                >
                  <ChevronUp className="h-6 w-6" />
                </button>
                <button
                  onClick={goToNextApp}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-gray-800 rounded-full hover:bg-gray-700"
                >
                  <ChevronDown className="h-6 w-6" />
                </button>
                
                {/* 作成者情報 */}
                <div className="absolute left-4 bottom-4 flex items-center">
                  <img 
                    src={currentApp.creator.avatar} 
                    alt={currentApp.creator.username} 
                    className="w-10 h-10 rounded-full border-2 border-white"
                  />
                  <div className="ml-2">
                    <p className="font-medium">@{currentApp.creator.username}</p>
                    <p className="text-sm text-gray-400">{currentAppIndex + 1}/{apps.length}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* 発見 */}
        {activeSection === 'discover' && (
          <div className="flex-1 p-6">
            <h2 className="text-2xl font-bold mb-6">人気のアプリ</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {apps.map((app, index) => (
                <div key={app.id} className="bg-gray-800 rounded-lg overflow-hidden">
                  <div className="p-4 bg-gray-700 h-40 flex items-center justify-center">
                    <h3 className="text-xl font-bold text-center">{app.title}</h3>
                  </div>
                  <div className="p-4">
                    <p className="text-gray-300 text-sm mb-4 line-clamp-2">{app.description}</p>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <img 
                          src={app.creator.avatar} 
                          alt={app.creator.username} 
                          className="w-6 h-6 rounded-full"
                        />
                        <span className="ml-2 text-sm">@{app.creator.username}</span>
                      </div>
                      <div className="flex items-center">
                        <Heart className="h-4 w-4 text-red-500 mr-1" />
                        <span className="text-sm">{app.likes}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setCurrentAppIndex(index);
                        setActiveSection('feed');
                        setIsAppRunning(true);
                      }}
                      className="mt-4 w-full py-2 bg-purple-600 rounded font-medium hover:bg-purple-700 transition"
                    >
                      実行する
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* 通知 */}
        {activeSection === 'notifications' && (
          <div className="flex-1 p-6">
            <h2 className="text-2xl font-bold mb-6">通知</h2>
            <div className="space-y-4">
              <div className="bg-gray-800 rounded-lg p-4 flex items-start">
                <div className="bg-purple-100 p-2 rounded-full mr-4">
                  <Heart className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium">
                    <span className="text-purple-400">@gamecreator</span>さんがあなたのアプリに「いいね」しました
                  </p>
                  <p className="text-gray-400 text-sm">2時間前</p>
                </div>
              </div>
              <div className="bg-gray-800 rounded-lg p-4 flex items-start">
                <div className="bg-green-100 p-2 rounded-full mr-4">
                  <MessageSquare className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium">
                    <span className="text-purple-400">@pixelartist</span>さんがコメントしました：「素晴らしいアプリ！」
                  </p>
                  <p className="text-gray-400 text-sm">5時間前</p>
                </div>
              </div>
              <div className="bg-gray-800 rounded-lg p-4 flex items-start">
                <div className="bg-blue-100 p-2 rounded-full mr-4">
                  <Share2 className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">
                    <span className="text-purple-400">@productivityguru</span>さんがあなたのアプリを共有しました
                  </p>
                  <p className="text-gray-400 text-sm">1日前</p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* プロフィール */}
        {activeSection === 'profile' && (
          <div className="flex-1 p-6">
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="flex items-center mb-6">
                <img
                  src={currentUser.avatar}
                  alt="プロフィール画像"
                  className="w-20 h-20 rounded-full mr-6"
                />
                <div>
                  <h3 className="text-2xl font-bold">{currentUser.username}</h3>
                  <p className="text-gray-400 mt-1">{currentUser.bio}</p>
                  <div className="flex mt-4">
                    <div className="mr-6">
                      <span className="font-bold text-lg">42</span>
                      <p className="text-gray-400 text-sm">フォロワー</p>
                    </div>
                    <div>
                      <span className="font-bold text-lg">38</span>
                      <p className="text-gray-400 text-sm">フォロー中</p>
                    </div>
                  </div>
                </div>
              </div>
              <button className="bg-purple-600 px-4 py-2 rounded-md hover:bg-purple-700">
                プロフィールを編集
              </button>
            </div>
            
            <h3 className="text-xl font-bold mt-8 mb-4">私のアプリ</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {apps.filter(app => app.creator.id === currentUser.id).map((app) => (
                <div key={app.id} className="bg-gray-800 rounded-lg overflow-hidden">
                  <div className="p-4">
                    <h4 className="font-bold mb-2">{app.title}</h4>
                    <p className="text-gray-300 text-sm mb-4 line-clamp-2">{app.description}</p>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center">
                          <Heart className="h-4 w-4 text-red-500 mr-1" />
                          <span className="text-sm">{app.likes}</span>
                        </div>
                        <div className="flex items-center">
                          <MessageSquare className="h-4 w-4 text-blue-500 mr-1" />
                          <span className="text-sm">{app.comments}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          const index = apps.findIndex(a => a.id === app.id);
                          setCurrentAppIndex(index);
                          setActiveSection('feed');
                          setIsAppRunning(true);
                        }}
                        className="px-3 py-1 bg-purple-600 rounded text-sm hover:bg-purple-700 transition"
                      >
                        実行
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 text-center">
              <button
                onClick={() => setIsAIPromptOpen(true)}
                className="px-6 py-3 bg-purple-600 rounded-full font-medium flex items-center mx-auto hover:bg-purple-700 transition"
              >
                <PlusSquare className="mr-2 h-5 w-5" />
                新しいアプリを作成
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* AIプロンプトモーダル */}
      {isAIPromptOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-lg">
            <h2 className="text-2xl font-bold mb-4">AIにアプリを作らせる</h2>
            <p className="text-gray-300 mb-4">
              作りたいアプリの内容を日本語で詳しく説明してください。AIがブラウザで動作するHTMLアプリを自動生成します。
            </p>
            <textarea
              value={aiPrompt}
              onChange={(e) => setAIPrompt(e.target.value)}
              className="w-full h-32 px-3 py-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-white mb-4"
              placeholder="例: 簡単な2048ゲームを作って"
            ></textarea>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsAIPromptOpen(false)}
                className="px-4 py-2 border border-gray-500 rounded-md hover:bg-gray-700"
              >
                キャンセル
              </button>
              <button
                onClick={createAppWithAI}
                disabled={aiLoading || !aiPrompt.trim()}
                className={`px-4 py-2 bg-purple-600 text-white rounded-md ${
                  aiLoading || !aiPrompt.trim() ? 'opacity-50 cursor-not-allowed' : 'hover:bg-purple-700'
                }`}
              >
                {aiLoading ? 'アプリを生成中...' : 'アプリを生成'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppTokPlatform;
