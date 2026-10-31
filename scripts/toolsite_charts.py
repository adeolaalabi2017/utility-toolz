#!/usr/bin/env python3
"""Charts for the Utility Tools Platform build plan (English labels).
Generates 3 PNGs into /home/z/my-project/scripts/charts/
Also prints the illustrative revenue model table used in the document.
"""
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

OUT = "/home/z/my-project/scripts/charts"

plt.rcParams["font.sans-serif"] = ["DejaVu Sans"]
plt.rcParams["axes.unicode_minus"] = False

ACCENT = "#529286"      # DS-1 teal accent
NAVY = "#0B1C2C"        # deep navy
MUTED_BLUE = "#6B9DAD"  # Morandi low-saturation
MUTED_SAND = "#C49B72"
GREY = "#B0B0B0"

# ---------------------------------------------------------------
# Figure 1: cumulative tools live, months 1-6 (6-month roadmap)
# ---------------------------------------------------------------
months = [1, 2, 3, 4, 5, 6]
tools = [8, 20, 24, 30, 45, 60]

fig, ax = plt.subplots(figsize=(10, 5.2), constrained_layout=True)
ax.plot(months, tools, color=ACCENT, linewidth=2.5, marker="o",
        markersize=7, markerfacecolor=NAVY, markeredgecolor=NAVY, zorder=3)
ax.fill_between(months, tools, color=ACCENT, alpha=0.12, zorder=1)

annotations = {
    2: (20, "Week 8: MVP\n20 tools live"),
    4: (30, "Month 4: 30 tools\n(Advertising + Business)"),
    6: (60, "Month 6: 60 tools\nacross 9 domains"),
}
for m, (v, label) in annotations.items():
    ax.annotate(label, xy=(m, v), xytext=(m - 0.05, v + 7),
                fontsize=10, ha="center", color=NAVY,
                arrowprops=dict(arrowstyle="-", color=GREY, lw=0.8))

ax.set_xlabel("Month", fontsize=11)
ax.set_ylabel("Cumulative tools live", fontsize=11)
ax.set_title("Six-month rollout: cumulative tools live", fontsize=13,
             color=NAVY, fontweight="bold", pad=12)
ax.set_xticks(months)
ax.set_ylim(0, 78)
ax.axhline(78, color=GREY, linewidth=1, linestyle="--")
ax.text(1.02, 79.5, "78-tool catalogue target", fontsize=9, color="#707070")
ax.grid(True, alpha=0.3)
ax.spines["top"].set_visible(False)
ax.spines["right"].set_visible(False)
fig.savefig(f"{OUT}/fig1_roadmap_tools.png", dpi=200)
plt.close(fig)

# ---------------------------------------------------------------
# Figure 2: illustrative monthly organic sessions (months 6/12/24)
# ---------------------------------------------------------------
milestones = ["Month 6", "Month 12", "Month 24"]
sessions = [60000, 250000, 750000]

fig, ax = plt.subplots(figsize=(10, 5.2), constrained_layout=True)
bars = ax.bar(milestones, sessions, width=0.5,
              color=[MUTED_BLUE, ACCENT, NAVY], zorder=3)
for bar, s in zip(bars, sessions):
    ax.text(bar.get_x() + bar.get_width() / 2, s + 14000,
            f"{s:,}", ha="center", fontsize=11, color=NAVY, fontweight="bold")
ax.set_ylabel("Monthly sessions (illustrative)", fontsize=11)
ax.set_title("Illustrative monthly sessions trajectory", fontsize=13,
             color=NAVY, fontweight="bold", pad=12)
ax.set_ylim(0, 830000)
ax.yaxis.set_major_formatter(lambda x, pos: f"{int(x/1000)}k")
ax.grid(True, axis="y", alpha=0.3)
ax.spines["top"].set_visible(False)
ax.spines["right"].set_visible(False)
fig.savefig(f"{OUT}/fig2_sessions.png", dpi=200)
plt.close(fig)

# ---------------------------------------------------------------
# Figure 3: revenue mix at month 24 (pie, square figsize)
# ---------------------------------------------------------------
# Model: ads 4125, affiliate 1200, premium 15000 -> total 20325
labels = ["Premium subscriptions\n$15,000/mo", "Display advertising\n$4,125/mo", "Affiliate revenue\n$1,200/mo"]
values = [15000, 4125, 1200]
colors = [ACCENT, MUTED_BLUE, MUTED_SAND]

fig, ax = plt.subplots(figsize=(8, 8), constrained_layout=True)
wedges, texts, autotexts = ax.pie(
    values, labels=labels, colors=colors, autopct="%1.0f%%",
    startangle=90, counterclock=False,
    wedgeprops=dict(width=0.42, edgecolor="white", linewidth=2),
    textprops=dict(fontsize=11, color=NAVY),
    pctdistance=0.79)
for at in autotexts:
    at.set_color("white")
    at.set_fontweight("bold")
    at.set_fontsize(11)
ax.set_title("Illustrative revenue mix at month 24 ($20,325/mo)",
             fontsize=13, color=NAVY, fontweight="bold")
fig.savefig(f"{OUT}/fig3_revenue_mix.png", dpi=200)
plt.close(fig)

# ---------------------------------------------------------------
# Print the model table (verify arithmetic used in the document)
# ---------------------------------------------------------------
model = [
    # month, sessions, rpm, affiliate, conv, price
    (6, 60000, 4.00, 50, 0.001, 5),
    (12, 250000, 5.00, 350, 0.003, 5),
    (24, 750000, 5.50, 1200, 0.004, 5),
]
print(f"{'M':>3} {'Sessions':>9} {'Ads':>7} {'Affil':>6} {'Subs':>6} {'Premium':>8} {'Total':>8} {'Mix%':>18}")
for m, s, rpm, aff, conv, price in model:
    ads = s / 1000 * rpm
    subs = int(s * conv)
    prem = subs * price
    total = ads + aff + prem
    print(f"{m:>3} {s:>9,} {ads:>7,.0f} {aff:>6,.0f} {subs:>6,} {prem:>8,.0f} {total:>8,.0f} "
          f"{prem/total*100:>5.1f}/{ads/total*100:>4.1f}/{aff/total*100:>4.1f}")
print("Annualized M24 run-rate:", f"${20325*12:,.0f}")
print("Charts written to", OUT)
