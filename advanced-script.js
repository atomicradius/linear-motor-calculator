// 高级直线电机推力计算器
class AdvancedLinearMotorCalculator {
    constructor() {
        this.initializeEventListeners();
        this.loadDefaultValues();
        this.charts = {};
        this.initializeCharts();
    }

    // 初始化事件监听器
    initializeEventListeners() {
        const inputs = document.querySelectorAll('input[type="number"]');
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                this.calculate();
            });
        });

        window.addEventListener('load', () => {
            this.calculate();
        });
    }

    // 初始化图表
    initializeCharts() {
        // 推力图表
        const forceCtx = document.getElementById('forceChart').getContext('2d');
        this.charts.force = new Chart(forceCtx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: '理论推力 (N)',
                    data: [],
                    borderColor: 'rgb(75, 192, 192)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    tension: 0.1
                }, {
                    label: '实际推力 (N)',
                    data: [],
                    borderColor: 'rgb(255, 99, 132)',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: '推力-速度曲线'
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: '速度 (m/s)'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: '推力 (N)'
                        }
                    }
                }
            }
        });

        // 功率图表
        const powerCtx = document.getElementById('powerChart').getContext('2d');
        this.charts.power = new Chart(powerCtx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: '所需功率 (W)',
                    data: [],
                    borderColor: 'rgb(54, 162, 235)',
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    tension: 0.1
                }, {
                    label: '额定功率 (W)',
                    data: [],
                    borderColor: 'rgb(255, 159, 64)',
                    backgroundColor: 'rgba(255, 159, 64, 0.2)',
                    borderDash: [5, 5],
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: '功率-速度曲线'
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: '速度 (m/s)'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: '功率 (W)'
                        }
                    }
                }
            }
        });
    }

    // 加载默认值
    loadDefaultValues() {
        const defaults = {
            voltage: 220,
            current: 5,
            power: 1000,
            efficiency: 85,
            mass: 50,
            acceleration: 2,
            friction: 0.1,
            gravity: 9.81,
            temperature: 25,
            altitude: 0,
            dutyCycle: 100,
            speedRange: 5,
            speedSteps: 20
        };

        Object.keys(defaults).forEach(key => {
            const element = document.getElementById(key);
            if (element) {
                element.value = defaults[key];
            }
        });
    }

    // 获取输入参数
    getInputParameters() {
        return {
            voltage: parseFloat(document.getElementById('voltage').value) || 0,
            current: parseFloat(document.getElementById('current').value) || 0,
            power: parseFloat(document.getElementById('power').value) || 0,
            efficiency: parseFloat(document.getElementById('efficiency').value) || 0,
            mass: parseFloat(document.getElementById('mass').value) || 0,
            acceleration: parseFloat(document.getElementById('acceleration').value) || 0,
            friction: parseFloat(document.getElementById('friction').value) || 0,
            gravity: parseFloat(document.getElementById('gravity').value) || 9.81,
            temperature: parseFloat(document.getElementById('temperature').value) || 25,
            altitude: parseFloat(document.getElementById('altitude').value) || 0,
            dutyCycle: parseFloat(document.getElementById('dutyCycle').value) || 100,
            speedRange: parseFloat(document.getElementById('speedRange').value) || 5,
            speedSteps: parseInt(document.getElementById('speedSteps').value) || 20
        };
    }

    // 计算理论推力（考虑速度）
    calculateTheoreticalForce(params, speed = 1) {
        const efficiencyDecimal = params.efficiency / 100;
        let theoreticalForce = (params.power * efficiencyDecimal) / speed;
        
        if (theoreticalForce === 0 && params.voltage > 0 && params.current > 0) {
            theoreticalForce = (params.voltage * params.current * efficiencyDecimal) / speed;
        }
        
        return Math.max(0, theoreticalForce);
    }

    // 计算实际推力（考虑速度）
    calculateActualForce(params, theoreticalForce, speed = 1) {
        const frictionForce = params.mass * params.gravity * params.friction;
        const dutyCycleFactor = params.dutyCycle / 100;
        const adjustedTheoreticalForce = theoreticalForce * dutyCycleFactor;
        
        const actualForce = adjustedTheoreticalForce - frictionForce;
        
        return Math.max(0, actualForce);
    }

    // 计算所需功率（考虑速度）
    calculateRequiredPower(params, speed = 1) {
        const efficiencyDecimal = params.efficiency / 100;
        const requiredPower = (params.mass * params.acceleration * speed) / efficiencyDecimal;
        
        return Math.max(0, requiredPower);
    }

    // 计算安全系数
    calculateSafetyFactor(theoreticalForce, actualForce, requiredPower, inputPower) {
        if (actualForce <= 0 || requiredPower <= 0) return 0;
        
        const requiredForce = requiredPower;
        const forceSafetyFactor = actualForce / requiredForce;
        const powerSafetyFactor = inputPower / requiredPower;
        const safetyFactor = Math.min(forceSafetyFactor, powerSafetyFactor);
        
        return Math.max(0, safetyFactor);
    }

    // 评估效率
    evaluateEfficiency(efficiency) {
        if (efficiency >= 90) return { rating: '优秀', class: 'success' };
        if (efficiency >= 80) return { rating: '良好', class: 'success' };
        if (efficiency >= 70) return { rating: '一般', class: 'warning' };
        return { rating: '较差', class: 'error' };
    }

    // 推荐型号
    recommendModel(theoreticalForce, safetyFactor) {
        if (safetyFactor >= 2.0) {
            return { model: 'CSK-1000', description: '高功率型号，适用于重载应用' };
        } else if (safetyFactor >= 1.5) {
            return { model: 'CSK-750', description: '中功率型号，适用于标准应用' };
        } else if (safetyFactor >= 1.2) {
            return { model: 'CSK-500', description: '标准型号，适用于轻载应用' };
        } else {
            return { model: 'CSK-1000+', description: '超功率型号，建议升级' };
        }
    }

    // 生成多点分析数据
    generateMultiPointAnalysis(params) {
        const speeds = [];
        const theoreticalForces = [];
        const actualForces = [];
        const requiredPowers = [];
        const ratedPowers = [];

        const stepSize = params.speedRange / params.speedSteps;
        
        for (let i = 0; i <= params.speedSteps; i++) {
            const speed = i * stepSize;
            speeds.push(speed);
            
            const theoreticalForce = this.calculateTheoreticalForce(params, speed);
            const actualForce = this.calculateActualForce(params, theoreticalForce, speed);
            const requiredPower = this.calculateRequiredPower(params, speed);
            
            theoreticalForces.push(theoreticalForce);
            actualForces.push(actualForce);
            requiredPowers.push(requiredPower);
            ratedPowers.push(params.power);
        }

        return {
            speeds,
            theoreticalForces,
            actualForces,
            requiredPowers,
            ratedPowers
        };
    }

    // 更新图表
    updateCharts(analysisData) {
        // 更新推力图表
        this.charts.force.data.labels = analysisData.speeds.map(s => s.toFixed(1));
        this.charts.force.data.datasets[0].data = analysisData.theoreticalForces;
        this.charts.force.data.datasets[1].data = analysisData.actualForces;
        this.charts.force.update();

        // 更新功率图表
        this.charts.power.data.labels = analysisData.speeds.map(s => s.toFixed(1));
        this.charts.power.data.datasets[0].data = analysisData.requiredPowers;
        this.charts.power.data.datasets[1].data = analysisData.ratedPowers;
        this.charts.power.update();
    }

    // 主计算函数
    calculate() {
        const params = this.getInputParameters();
        
        // 执行基础计算
        const theoreticalForce = this.calculateTheoreticalForce(params);
        const actualForce = this.calculateActualForce(params, theoreticalForce);
        const requiredPower = this.calculateRequiredPower(params);
        const safetyFactor = this.calculateSafetyFactor(theoreticalForce, actualForce, requiredPower, params.power);
        const efficiencyRating = this.evaluateEfficiency(params.efficiency);
        const recommendedModel = this.recommendModel(theoreticalForce, safetyFactor);
        
        // 执行多点分析
        const analysisData = this.generateMultiPointAnalysis(params);
        
        // 更新结果显示
        this.updateResults({
            theoreticalForce,
            actualForce,
            requiredPower,
            safetyFactor,
            efficiencyRating,
            recommendedModel
        });
        
        // 更新图表
        this.updateCharts(analysisData);
    }

    // 更新结果显示
    updateResults(results) {
        document.getElementById('theoreticalForce').textContent = `${results.theoreticalForce.toFixed(2)} N`;
        document.getElementById('actualForce').textContent = `${results.actualForce.toFixed(2)} N`;
        document.getElementById('requiredPower').textContent = `${results.requiredPower.toFixed(2)} W`;
        document.getElementById('safetyFactor').textContent = results.safetyFactor.toFixed(2);
        document.getElementById('efficiencyRating').textContent = results.efficiencyRating.rating;
        document.getElementById('efficiencyRating').className = `result-value ${results.efficiencyRating.class}`;
        document.getElementById('recommendedModel').textContent = results.recommendedModel.model;
    }

    // 重置表单
    resetForm() {
        this.loadDefaultValues();
        this.calculate();
    }

    // 导出结果
    exportResults() {
        const params = this.getInputParameters();
        const results = {
            theoreticalForce: parseFloat(document.getElementById('theoreticalForce').textContent),
            actualForce: parseFloat(document.getElementById('actualForce').textContent),
            requiredPower: parseFloat(document.getElementById('requiredPower').textContent),
            safetyFactor: parseFloat(document.getElementById('safetyFactor').textContent),
            efficiencyRating: document.getElementById('efficiencyRating').textContent,
            recommendedModel: document.getElementById('recommendedModel').textContent
        };

        const analysisData = this.generateMultiPointAnalysis(params);

        const exportData = {
            timestamp: new Date().toISOString(),
            parameters: params,
            results: results,
            analysisData: analysisData
        };

        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `高级直线电机推力计算结果_${new Date().toISOString().slice(0, 10)}.json`;
        link.click();
    }

    // 生成图表
    generateCharts() {
        this.calculate();
    }
}

// 全局函数
function calculate() {
    if (!window.advancedCalculator) {
        window.advancedCalculator = new AdvancedLinearMotorCalculator();
    }
    window.advancedCalculator.calculate();
}

function resetForm() {
    if (!window.advancedCalculator) {
        window.advancedCalculator = new AdvancedLinearMotorCalculator();
    }
    window.advancedCalculator.resetForm();
}

function exportResults() {
    if (!window.advancedCalculator) {
        window.advancedCalculator = new AdvancedLinearMotorCalculator();
    }
    window.advancedCalculator.exportResults();
}

function generateCharts() {
    if (!window.advancedCalculator) {
        window.advancedCalculator = new AdvancedLinearMotorCalculator();
    }
    window.advancedCalculator.generateCharts();
}

// 初始化计算器
document.addEventListener('DOMContentLoaded', () => {
    window.advancedCalculator = new AdvancedLinearMotorCalculator();
});

// 键盘快捷键
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'Enter') {
        calculate();
    }
    if (e.ctrlKey && e.key === 'r') {
        e.preventDefault();
        resetForm();
    }
    if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        exportResults();
    }
    if (e.ctrlKey && e.key === 'g') {
        e.preventDefault();
        generateCharts();
    }
});

// 输入验证
function validateInput(input) {
    const value = parseFloat(input.value);
    const min = parseFloat(input.min);
    const max = parseFloat(input.max);
    
    if (input.min && value < min) {
        input.value = min;
    }
    if (input.max && value > max) {
        input.value = max;
    }
    
    if (isNaN(value) || value < 0) {
        input.value = 0;
    }
}

document.addEventListener('input', (e) => {
    if (e.target.type === 'number') {
        validateInput(e.target);
    }
}); 