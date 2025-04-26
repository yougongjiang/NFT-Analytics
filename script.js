document.addEventListener('DOMContentLoaded', () => {
    const nftInput = document.getElementById('nftInput');
    const analyzeBtn = document.getElementById('analyzeBtn');
    const loadingIndicator = document.getElementById('loadingIndicator');
    const dashboard = document.getElementById('dashboard');

    // 图表实例
    let priceChart, socialChart, rarityChart, signalChart;

    // 钱包连接相关变量
    let web3;
    let currentAccount = null;
    const connectWalletBtn = document.getElementById('connectWallet');
    const walletModal = document.getElementById('walletModal');
    const walletInfo = document.getElementById('walletInfo');
    const walletAddress = document.getElementById('walletAddress');
    const disconnectWalletBtn = document.getElementById('disconnectWallet');

    // 检查是否已安装MetaMask
    async function checkMetaMask() {
        if (typeof window.ethereum !== 'undefined') {
            web3 = new Web3(window.ethereum);
            try {
                const accounts = await window.ethereum.request({ method: 'eth_accounts' });
                if (accounts.length > 0) {
                    currentAccount = accounts[0];
                    updateWalletUI();
                }
            } catch (error) {
                console.error('Error checking MetaMask:', error);
            }
        }
    }

    // 连接MetaMask钱包
    async function connectMetaMask() {
        if (typeof window.ethereum !== 'undefined') {
            try {
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                currentAccount = accounts[0];
                updateWalletUI();
                walletModal.style.display = 'none';
            } catch (error) {
                console.error('Error connecting to MetaMask:', error);
            }
        } else {
            alert('请安装MetaMask钱包');
        }
    }

    // 更新钱包UI
    function updateWalletUI() {
        if (currentAccount) {
            connectWalletBtn.textContent = '已连接';
            walletInfo.style.display = 'block';
            walletAddress.textContent = `${currentAccount.slice(0, 6)}...${currentAccount.slice(-4)}`;
        } else {
            connectWalletBtn.textContent = '连接钱包';
            walletInfo.style.display = 'none';
        }
    }

    // 断开钱包连接
    function disconnectWallet() {
        currentAccount = null;
        updateWalletUI();
    }

    // 事件监听器
    connectWalletBtn.addEventListener('click', () => {
        walletModal.style.display = 'block';
    });

    document.querySelector('.wallet-option[data-wallet="metamask"]').addEventListener('click', connectMetaMask);
    disconnectWalletBtn.addEventListener('click', disconnectWallet);

    // 点击模态框外部关闭
    window.addEventListener('click', (event) => {
        if (event.target === walletModal) {
            walletModal.style.display = 'none';
        }
    });

    // 初始化检查MetaMask
    checkMetaMask();

    // 监听账户变化
    if (window.ethereum) {
        window.ethereum.on('accountsChanged', (accounts) => {
            if (accounts.length === 0) {
                currentAccount = null;
            } else {
                currentAccount = accounts[0];
            }
            updateWalletUI();
        });
    }

    // 初始化图表
    function initCharts() {
        // 价格趋势图
        const priceCtx = document.getElementById('priceChart').getContext('2d');
        priceChart = new Chart(priceCtx, {
            type: 'line',
            data: {
                labels: ['1月', '2月', '3月', '4月', '5月', '6月', '7月'],
                datasets: [{
                    label: '价格趋势',
                    data: [2.1, 2.3, 2.4, 2.2, 2.5, 2.6, 2.5],
                    borderColor: 'rgb(75, 192, 192)',
                    backgroundColor: 'rgba(75, 192, 192, 0.1)',
                    tension: 0.4,
                    fill: true,
                    pointRadius: 4,
                    pointHoverRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleFont: {
                            size: 14,
                            weight: 'bold'
                        },
                        bodyFont: {
                            size: 12
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });

        // 社交热度图
        const socialCtx = document.getElementById('socialChart').getContext('2d');
        socialChart = new Chart(socialCtx, {
            type: 'bar',
            data: {
                labels: ['Twitter', 'Discord', '其他'],
                datasets: [{
                    label: '社交平台活跃度',
                    data: [65, 80, 45],
                    backgroundColor: [
                        'rgba(54, 162, 235, 0.7)',
                        'rgba(255, 99, 132, 0.7)',
                        'rgba(255, 206, 86, 0.7)'
                    ],
                    borderColor: [
                        'rgb(54, 162, 235)',
                        'rgb(255, 99, 132)',
                        'rgb(255, 206, 86)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleFont: {
                            size: 14,
                            weight: 'bold'
                        },
                        bodyFont: {
                            size: 12
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });

        // 稀有度分布图
        const rarityCtx = document.getElementById('rarityChart').getContext('2d');
        rarityChart = new Chart(rarityCtx, {
            type: 'doughnut',
            data: {
                labels: ['普通', '稀有', '史诗', '传说'],
                datasets: [{
                    data: [30, 40, 20, 10],
                    backgroundColor: [
                        'rgba(201, 203, 207, 0.8)',
                        'rgba(255, 159, 64, 0.8)',
                        'rgba(153, 102, 255, 0.8)',
                        'rgba(255, 99, 132, 0.8)'
                    ],
                    borderColor: [
                        'rgb(201, 203, 207)',
                        'rgb(255, 159, 64)',
                        'rgb(153, 102, 255)',
                        'rgb(255, 99, 132)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            font: {
                                size: 12
                            },
                            padding: 20
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleFont: {
                            size: 14,
                            weight: 'bold'
                        },
                        bodyFont: {
                            size: 12
                        }
                    }
                },
                cutout: '70%'
            }
        });

        // 信号强度图
        const signalCtx = document.getElementById('signalChart').getContext('2d');
        signalChart = new Chart(signalCtx, {
            type: 'radar',
            data: {
                labels: ['价格趋势', '社交热度', '稀有度', '市场情绪', '交易量'],
                datasets: [{
                    label: '信号强度',
                    data: [85, 75, 90, 80, 70],
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgb(54, 162, 235)',
                    pointBackgroundColor: 'rgb(54, 162, 235)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgb(54, 162, 235)'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleFont: {
                            size: 14,
                            weight: 'bold'
                        },
                        bodyFont: {
                            size: 12
                        }
                    }
                },
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            stepSize: 20
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        }
                    }
                }
            }
        });
    }

    // 模拟API调用和分析过程
    analyzeBtn.addEventListener('click', async () => {
        const nftName = nftInput.value.trim();
        
        if (!nftName) {
            alert('请输入NFT名称或合约地址');
            return;
        }

        // 显示加载状态
        loadingIndicator.style.display = 'block';
        dashboard.style.display = 'none';

        try {
            // 模拟API调用延迟
            await new Promise(resolve => setTimeout(resolve, 2000));

            // 模拟数据
            const mockData = {
                marketData: {
                    avgPrice: '19.18k',
                    volume: '706.69k',
                    floorPrice: '15.08k',
                    marketCap: '134.05M',
                    priceHistory: [2.1, 2.3, 2.4, 2.2, 2.5, 2.6, 2.5],
                    priceLabels: ['1月', '2月', '3月', '4月', '5月', '6月', '7月']
                },
                socialHeat: {
                    twitterGrowth: '+15%',
                    discordActivity: '高',
                    marketSentiment: '积极',
                    socialData: [65, 80, 45]
                },
                rarity: {
                    rarityScore: '8.5/10',
                    traitDistribution: '稀有',
                    rarityDistribution: [30, 40, 20, 10]
                },
                investment: {
                    investmentAdvice: '买入',
                    signalStrength: '强',
                    signalData: [85, 75, 90, 80, 70]
                }
            };

            // 更新UI
            updateDashboard(mockData);
            updateCharts(mockData);

            // 隐藏加载状态，显示仪表盘
            loadingIndicator.style.display = 'none';
            dashboard.style.display = 'block';

        } catch (error) {
            console.error('分析过程中出现错误:', error);
            alert('分析过程中出现错误，请稍后重试');
            loadingIndicator.style.display = 'none';
        }
    });

    // 更新仪表盘数据
    function updateDashboard(data) {
        // 市场数据
        document.getElementById('avgPrice').textContent = data.marketData.avgPrice;
        document.getElementById('volume').textContent = data.marketData.volume;
        document.getElementById('floorPrice').textContent = data.marketData.floorPrice;
        document.getElementById('marketCap').textContent = data.marketData.marketCap;

        // 社交热度
        document.getElementById('twitterGrowth').textContent = data.socialHeat.twitterGrowth;
        document.getElementById('discordActivity').textContent = data.socialHeat.discordActivity;
        document.getElementById('marketSentiment').textContent = data.socialHeat.marketSentiment;

        // 稀有度
        document.getElementById('rarityScore').textContent = data.rarity.rarityScore;
        document.getElementById('traitDistribution').textContent = data.rarity.traitDistribution;

        // 投资策略
        document.getElementById('investmentAdvice').textContent = data.investment.investmentAdvice;
        document.getElementById('signalStrength').textContent = data.investment.signalStrength;

        // 根据投资建议设置颜色
        const adviceElement = document.getElementById('investmentAdvice');
        if (data.investment.investmentAdvice === '买入') {
            adviceElement.style.color = 'var(--success-color)';
        } else if (data.investment.investmentAdvice === '卖出') {
            adviceElement.style.color = 'var(--danger-color)';
        } else {
            adviceElement.style.color = 'var(--warning-color)';
        }
    }

    // 更新图表数据
    function updateCharts(data) {
        // 更新价格趋势图
        priceChart.data.labels = data.marketData.priceLabels;
        priceChart.data.datasets[0].data = data.marketData.priceHistory;
        priceChart.update();

        // 更新社交热度图
        socialChart.data.datasets[0].data = data.socialHeat.socialData;
        socialChart.update();

        // 更新稀有度分布图
        rarityChart.data.datasets[0].data = data.rarity.rarityDistribution;
        rarityChart.update();

        // 更新信号强度图
        signalChart.data.datasets[0].data = data.investment.signalData;
        signalChart.update();
    }

    // 添加回车键支持
    nftInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            analyzeBtn.click();
        }
    });

    // 初始化图表
    initCharts();
}); 