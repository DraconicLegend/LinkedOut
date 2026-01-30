# Quick Setup Guide - Sidechat Auto-Poster

## ✅ What's Been Set Up

I've created an automated posting system for your Sidechat bot. Here's what was added:

### 📁 New Files Created

1. **`data/autopost.py`** - Main automation script
   - Runs `activateAgent.py` to generate content
   - Posts the output to your Supabase database
   - Handles errors and logs progress

2. **`data/AutoPost-TaskScheduler.xml`** - Windows Task Scheduler configuration
   - Schedules daily posts at 8:00 AM Eastern Time
   - Auto-wakes computer if needed
   - Requires network connectivity

3. **`data/setup-scheduler.ps1`** - Automated setup script
   - One-click task scheduler registration
   - Includes testing and verification
   - User-friendly with colored output

4. **`data/AUTOPOST-README.md`** - Comprehensive documentation
   - Full setup instructions
   - Troubleshooting guide
   - Customization options

5. **`data/test_autopost.py`** - Testing utility
   - Verify content generation works
   - No database posting (safe to test)

### 🔄 Modified Files

- **`requirements.txt`** - Added dependencies:
  - `supabase` - Python client for Supabase
  - `python-dotenv` - Environment variable support

## 🚀 Quick Start (3 Steps)

### 1️⃣ Install Dependencies (Already Done!)
```powershell
cd "C:\Users\There\StudioPrograms\Spicy Stuff\Sidechat"
pip install -r requirements.txt  # ✅ Already completed
```

### 2️⃣ Test the System
```powershell
cd data
python test_autopost.py  # Test content generation only
```

If that works, test the full pipeline:
```powershell
python autopost.py  # Will post to your database
```

### 3️⃣ Set Up the Schedule
```powershell
cd data
powershell -ExecutionPolicy Bypass .\setup-scheduler.ps1
```

Follow the prompts to:
- Register the scheduled task
- Optionally test it immediately
- View management commands

## 🎯 What Happens Daily

```
8:00 AM ET
   ↓
Windows Task Scheduler triggers
   ↓
Runs: python autopost.py
   ↓
1. Picks random topic from prompts.json
2. Generates satirical content via Ollama
3. Posts to Supabase as "SatireBot"
   ↓
New post appears on Sidechat feed
```

## ⚙️ Key Configuration

### Bot Username
Default: `SatireBot`
To change: Edit `autopost.py` line 55

### Posting Time
Default: `8:00 AM Eastern Time (-05:00)`
To change: Edit `AutoPost-TaskScheduler.xml` and re-run setup

### LLM Model
Default: `llama3.1` with temperature `0.8`
To change: Edit `activateAgent.py` line 25

## 🔍 Verify It's Working

After setup, check:

1. **Task is registered:**
   ```powershell
   Get-ScheduledTask -TaskName "Sidechat-AutoPost-Daily"
   ```

2. **Next run time:**
   ```powershell
   Get-ScheduledTaskInfo -TaskName "Sidechat-AutoPost-Daily" | Select NextRunTime
   ```

3. **Test manually:**
   ```powershell
   Start-ScheduledTask -TaskName "Sidechat-AutoPost-Daily"
   ```

4. **Check Sidechat feed:**
   - Look for username "SatireBot"
   - Should appear shortly after running

## 🆘 Common Issues

### "Supabase credentials not found"
**Fix:** Ensure `.env.local` exists in project root with:
```
NEXT_PUBLIC_SUPABASE_URL=your_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key_here
```

### "Agent produced no output"
**Fix:** Check Ollama is running:
```powershell
ollama list
ollama pull llama3.1
```

### Task doesn't run at 8 AM
**Fix:** Check Task Scheduler:
- Open Task Scheduler app
- Find "Sidechat-AutoPost-Daily"
- Check "History" tab for errors
- Verify "Next Run Time" is correct

## 📚 Full Documentation

For detailed information, see:
- **`data/AUTOPOST-README.md`** - Complete guide with troubleshooting
- **Task Scheduler** - GUI for viewing logs and history

## 🎛️ Management Commands

```powershell
# View status
Get-ScheduledTask -TaskName "Sidechat-AutoPost-Daily"

# Run now (testing)
Start-ScheduledTask -TaskName "Sidechat-AutoPost-Daily"

# Pause auto-posting
Disable-ScheduledTask -TaskName "Sidechat-AutoPost-Daily"

# Resume auto-posting
Enable-ScheduledTask -TaskName "Sidechat-AutoPost-Daily"

# Remove completely
Unregister-ScheduledTask -TaskName "Sidechat-AutoPost-Daily"
```

## ✨ Success Checklist

- [ ] Python packages installed (`pip install -r requirements.txt`)
- [ ] Ollama running with llama3.1 model
- [ ] `.env.local` contains Supabase credentials
- [ ] `python test_autopost.py` works
- [ ] `python autopost.py` successfully posts
- [ ] Scheduled task registered
- [ ] Test run successful
- [ ] Waiting for first 8 AM auto-post!

---

**Need Help?** Check `AUTOPOST-README.md` for detailed troubleshooting and customization options.
