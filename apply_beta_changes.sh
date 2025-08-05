#!/bin/bash

echo "Applying Beta Dashboard Consolidation Changes..."

# Create the new beta tester dashboard
cat > dashboard/beta-tester-dashboard.html << 'DASHBOARD_END'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Beta Tester Dashboard | TiltCheck</title>
    <meta name="description" content="TiltCheck beta tester dashboard with access to new features and feedback tools.">
    <script src="/js/coming-soon-popup.js"></script>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Arial', sans-serif;
            background: linear-gradient(135deg, #0a0a0a 0%, #2a1810 50%, #4a3728 100%);
            color: #ffffff; line-height: 1.6; min-height: 100vh;
        }
        .dashboard-container { max-width: 1400px; margin: 0 auto; padding: 20px; }
        .header { 
            display: flex; justify-content: space-between; align-items: center;
            margin-bottom: 30px; padding: 20px;
            background: rgba(255, 255, 255, 0.05); border-radius: 15px;
            border: 1px solid rgba(255, 193, 7, 0.3);
        }
        .logo { 
            font-size: 1.8rem; font-weight: bold; color: #ffc107;
            text-shadow: 0 0 15px rgba(255, 193, 7, 0.5);
        }
        .beta-badge { 
            background: linear-gradient(45deg, #ffc107, #ff9800);
            color: #000; padding: 5px 12px; border-radius: 20px;
            font-weight: bold; font-size: 0.8rem;
        }
        .navigation { 
            display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px; margin-bottom: 30px;
        }
        .nav-card { 
            background: rgba(255, 255, 255, 0.05); border-radius: 12px;
            padding: 20px; text-align: center;
            border: 1px solid rgba(255, 193, 7, 0.2);
            cursor: pointer; transition: all 0.3s ease;
        }
        .nav-card:hover { 
            transform: translateY(-5px);
            box-shadow: 0 10px 30px rgba(255, 193, 7, 0.3);
            border-color: rgba(255, 193, 7, 0.5);
        }
        .nav-card h3 { color: #ffc107; margin-bottom: 10px; font-size: 1.2rem; }
        .nav-card p { color: #cccccc; font-size: 0.9rem; }
        .btn { 
            background: linear-gradient(45deg, #ffc107, #ff9800);
            color: #000; padding: 12px 24px; border: none;
            border-radius: 8px; font-weight: bold; cursor: pointer;
            transition: all 0.3s ease;
        }
        .btn:hover { 
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(255, 193, 7, 0.4);
        }
    </style>
</head>
<body>
    <div class="dashboard-container">
        <div class="header">
            <div class="logo">TiltCheck Beta Dashboard</div>
            <div>
                <span class="beta-badge">BETA TESTER</span>
                <span id="user-name">Beta Tester</span>
            </div>
        </div>
        
        <div class="navigation">
            <div class="nav-card">
                <h3>TiltCheck Monitor</h3>
                <p>Access the live TiltCheck monitoring dashboard</p>
                <button class="btn" onclick="window.open('/tiltcheck', '_blank')">Launch TiltCheck</button>
            </div>
            <div class="nav-card">
                <h3>Discord Features</h3>
                <p>Test bot commands and Discord integrations</p>
                <button class="btn" onclick="window.open('https://discord.gg/K3Md6aZx', '_blank')">Test in Discord</button>
            </div>
            <div class="nav-card">
                <h3>Feedback System</h3>
                <p>Submit feedback and bug reports</p>
                <button class="btn" onclick="alert('Feedback submitted!')">Submit Feedback</button>
            </div>
        </div>
    </div>
    
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            if (typeof ComingSoonPopup !== 'undefined') {
                const popup = new ComingSoonPopup();
                popup.init();
            }
        });
    </script>
</body>
</html>
DASHBOARD_END

# Create the new beta admin dashboard
cat > dashboard/beta-admin-dashboard.html << 'ADMIN_END'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Beta Admin Dashboard | TiltCheck</title>
    <meta name="description" content="TiltCheck beta testing administration and analytics dashboard.">
    <script src="/js/coming-soon-popup.js"></script>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Arial', sans-serif;
            background: linear-gradient(135deg, #0a0a0a 0%, #2a1810 50%, #4a3728 100%);
            color: #ffffff; line-height: 1.6; min-height: 100vh;
        }
        .admin-container { max-width: 1600px; margin: 0 auto; padding: 20px; }
        .header { 
            display: flex; justify-content: space-between; align-items: center;
            margin-bottom: 30px; padding: 20px;
            background: rgba(255, 255, 255, 0.05); border-radius: 15px;
            border: 1px solid rgba(255, 193, 7, 0.3);
        }
        .logo { 
            font-size: 1.8rem; font-weight: bold; color: #ffc107;
            text-shadow: 0 0 15px rgba(255, 193, 7, 0.5);
        }
        .admin-badge { 
            background: linear-gradient(45deg, #ff4444, #cc0000);
            color: white; padding: 5px 12px; border-radius: 20px;
            font-weight: bold; font-size: 0.8rem;
        }
        .metrics-grid { 
            display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px; margin-bottom: 30px;
        }
        .metric-card { 
            background: rgba(255, 255, 255, 0.05); border-radius: 12px;
            padding: 25px; border: 1px solid rgba(255, 193, 7, 0.2);
            text-align: center;
        }
        .metric-number { 
            font-size: 2.5rem; font-weight: bold; color: #ffc107;
            display: block; margin-bottom: 5px;
        }
        .metric-label { color: #cccccc; font-size: 0.9rem; }
        .control-btn { 
            background: linear-gradient(45deg, #ffc107, #ff9800);
            color: #000; padding: 12px 20px; border: none;
            border-radius: 8px; font-weight: bold; cursor: pointer;
            transition: all 0.3s ease; margin: 5px;
        }
        .control-btn:hover { 
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(255, 193, 7, 0.4);
        }
    </style>
</head>
<body>
    <div class="admin-container">
        <div class="header">
            <div class="logo">TiltCheck Beta Admin Dashboard</div>
            <div>
                <span class="admin-badge">ADMIN</span>
                <span>Administrator Panel</span>
            </div>
        </div>
        
        <div class="metrics-grid">
            <div class="metric-card">
                <span class="metric-number">47</span>
                <div class="metric-label">Active Beta Testers</div>
            </div>
            <div class="metric-card">
                <span class="metric-number">156</span>
                <div class="metric-label">Feedback Items</div>
            </div>
            <div class="metric-card">
                <span class="metric-number">23</span>
                <div class="metric-label">Bugs Reported</div>
            </div>
            <div class="metric-card">
                <span class="metric-number">82</span>
                <div class="metric-label">Avg Beta Score</div>
            </div>
        </div>
        
        <div style="background: rgba(255, 255, 255, 0.05); border-radius: 15px; padding: 25px; border: 1px solid rgba(255, 193, 7, 0.3);">
            <h2 style="color: #ffc107; margin-bottom: 20px;">Beta Control Panel</h2>
            <button class="control-btn" onclick="alert('Beta data exported')">Export Beta Data</button>
            <button class="control-btn" onclick="alert('Notification sent')">Send Notification</button>
            <button class="control-btn" onclick="alert('Report generated')">Generate Report</button>
        </div>
    </div>
    
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            if (typeof ComingSoonPopup !== 'undefined') {
                const popup = new ComingSoonPopup();
                popup.init();
            }
        });
    </script>
</body>
</html>
ADMIN_END

echo "Beta dashboard files created successfully!"
