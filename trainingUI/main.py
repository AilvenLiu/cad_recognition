import sys
import random
import numpy as np

try:
    import tkinter as tk
    from tkinter import ttk, font as tkFont
    from ttkthemes import ThemedTk
    import matplotlib.pyplot as plt
    from matplotlib.backends.backend_tkagg import FigureCanvasTkAgg
except ImportError:
    print("Error: Required libraries not detected. Please install them via:")
    print("pip install tkinter ttkthemes matplotlib numpy")
    sys.exit(1)

class ModelTrainingGUI:
    def __init__(self, master):
        self.master = master
        self.master.title("CAD Matching Model Training")
        self.master.geometry("1800x1000")
        
        self.create_styles()
        self.create_widgets()

    def create_styles(self):
        self.title_font = tkFont.Font(family="Helvetica", size=24, weight="bold")
        self.header_font = tkFont.Font(family="Helvetica", size=18, weight="bold")
        self.subheader_font = tkFont.Font(family="Helvetica", size=16)
        self.text_font = tkFont.Font(family="Helvetica", size=14)

        style = ttk.Style()
        style.theme_use("clam")

        style.configure("TFrame", background="#f0f0f0")
        style.configure("TButton", padding=10, font=self.text_font)
        style.map("TButton", background=[('active', '#3498db'), ('!active', '#2980b9')], foreground=[('', 'white')])
        style.configure("TLabel", font=self.text_font, background="#f0f0f0")
        style.configure("Header.TLabel", font=self.header_font, foreground="#2c3e50", background="#f0f0f0")
        style.configure("Subheader.TLabel", font=self.subheader_font, foreground="#34495e", background="#f0f0f0")
        style.configure("Title.TLabel", font=self.title_font, foreground="#2c3e50", background="#f0f0f0")
        style.configure("TCheckbutton", font=self.text_font, background="#f0f0f0")
        style.configure("TRadiobutton", font=self.text_font, background="#f0f0f0")

        style.configure("Beautiful.TCheckbutton", background="#e0e0e0", foreground="#333333", font=self.text_font)
        style.map("Beautiful.TCheckbutton",
                  background=[('active', '#d0d0d0'), ('selected', '#3498db')],
                  foreground=[('selected', '#ffffff')])

        style.configure("Beautiful.TRadiobutton", background="#e0e0e0", foreground="#333333", font=self.text_font)
        style.map("Beautiful.TRadiobutton",
                  background=[('active', '#d0d0d0'), ('selected', '#3498db')],
                  foreground=[('selected', '#ffffff')])

    def create_widgets(self):
        main_frame = ttk.Frame(self.master, padding="20")
        main_frame.pack(fill=tk.BOTH, expand=True)

        ttk.Label(main_frame, text="CAD Matching Model Training", style="Title.TLabel").pack(pady=(0, 20))

        content_frame = ttk.Frame(main_frame)
        content_frame.pack(fill=tk.BOTH, expand=True)

        self.left_frame = ttk.Frame(content_frame)
        self.left_frame.grid(row=0, column=0, sticky="nsew", padx=(0, 10))

        self.right_frame = ttk.Frame(content_frame)
        self.right_frame.grid(row=0, column=1, sticky="nsew")

        content_frame.columnconfigure(0, weight=1)
        content_frame.columnconfigure(1, weight=2)
        content_frame.rowconfigure(0, weight=1)

        self.create_config_frame(self.left_frame)
        self.create_monitoring_frame(self.right_frame)

    def create_config_frame(self, parent):
        config_frame = ttk.Frame(parent)
        config_frame.pack(fill=tk.BOTH, expand=True)

        ttk.Label(config_frame, text="Configuration", style="Header.TLabel").pack(anchor="w", pady=(0, 10))

        # Model Architecture
        ttk.Label(config_frame, text="Model Architecture:", style="Subheader.TLabel").pack(anchor="w", pady=(10, 5))
        
        # Teacher Model
        ttk.Label(config_frame, text="Teacher Model:", style="TLabel").pack(anchor="w", padx=20, pady=(5, 2))
        teacher_models = ["ConvNeXt Tiny", "ResNet50", "EfficientNetB0"]
        self.teacher_var = tk.StringVar(value=teacher_models[0])
        teacher_menu = ttk.Combobox(config_frame, textvariable=self.teacher_var, values=teacher_models, state="readonly", font=self.text_font)
        teacher_menu.pack(anchor="w", padx=20, pady=(0, 10), fill=tk.X)

        # Student Model
        ttk.Label(config_frame, text="Student Model:", style="TLabel").pack(anchor="w", padx=20, pady=(5, 2))
        student_models = ["MobileNetV2", "MobileNetV3", "ShuffleNetV2"]
        self.student_var = tk.StringVar(value=student_models[0])
        student_menu = ttk.Combobox(config_frame, textvariable=self.student_var, values=student_models, state="readonly", font=self.text_font)
        student_menu.pack(anchor="w", padx=20, pady=(0, 10), fill=tk.X)

        # Loss Functions
        ttk.Label(config_frame, text="Loss Functions:", style="Subheader.TLabel").pack(anchor="w", pady=(20, 5))
        losses = ["Triplet", "NT-Xent", "ArcFace", "Classification", "BYOL", "Distillation"]
        for loss in losses:
            ttk.Checkbutton(config_frame, text=loss, style="Beautiful.TCheckbutton").pack(anchor="w", padx=20, pady=2)

        # Data Processing
        ttk.Label(config_frame, text="Data Augmentations:", style="Subheader.TLabel").pack(anchor="w", pady=(20, 5))
        augmentations = ["Random Flip", "Random Rotation", "Random Crop", "Color Jitter", "CLAHE"]
        for aug in augmentations:
            ttk.Checkbutton(config_frame, text=aug, style="Beautiful.TCheckbutton").pack(anchor="w", padx=20, pady=2)

        # Evaluation
        ttk.Label(config_frame, text="Distance Metric:", style="Subheader.TLabel").pack(anchor="w", pady=(20, 5))
        self.metric_var = tk.StringVar(value="euclidean")
        ttk.Radiobutton(config_frame, text="Euclidean Distance", variable=self.metric_var, value="euclidean", style="Beautiful.TRadiobutton").pack(anchor="w", padx=20, pady=2)
        ttk.Radiobutton(config_frame, text="Cosine Similarity", variable=self.metric_var, value="cosine", style="Beautiful.TRadiobutton").pack(anchor="w", padx=20, pady=2)

        # Global buttons
        ttk.Label(config_frame, text="Model Operations:", style="Header.TLabel").pack(anchor="w", pady=(30, 10))
        global_buttons = [
            ("Load Pre-train Model", self.load_pretrain_model),
            ("Save Threshold File", self.save_threshold_file),
            ("Save Model", self.save_model),
            ("Quantize Model", self.quantize_model),
            ("Export Model", self.export_model)
        ]
        
        for text, command in global_buttons:
            ttk.Button(config_frame, text=text, command=command).pack(anchor="w", padx=20, pady=5, fill=tk.X)

    def create_monitoring_frame(self, parent):
        ttk.Label(parent, text="Training Monitoring", style="Header.TLabel").pack(anchor="w", pady=(0, 5))

        chart_frame = ttk.Frame(parent)
        chart_frame.pack(fill=tk.BOTH, expand=True)

        self.fig, (self.ax1, self.ax2) = plt.subplots(2, 1, figsize=(6, 6), dpi=80)
        self.fig.tight_layout(pad=3.0)

        self.canvas = FigureCanvasTkAgg(self.fig, master=chart_frame)
        self.canvas.draw()
        self.canvas.get_tk_widget().pack(fill=tk.BOTH, expand=True)

        self.loss_line, = self.ax1.plot([], [], 'r-', label='Training Loss')
        self.val_loss_line, = self.ax1.plot([], [], 'b-', label='Validation Loss')
        self.acc_line, = self.ax2.plot([], [], 'g-', label='Training Accuracy')
        self.val_acc_line, = self.ax2.plot([], [], 'm-', label='Validation Accuracy')
        
        for ax in (self.ax1, self.ax2):
            ax.legend()
            ax.set_xlabel('Epoch')
        self.ax1.set_ylabel('Loss')
        self.ax2.set_ylabel('Accuracy')

        status_frame = ttk.Frame(parent)
        status_frame.pack(fill=tk.X, pady=10)

        self.status_var = tk.StringVar(value="Status: Not Started")
        ttk.Label(status_frame, textvariable=self.status_var).pack(side=tk.LEFT, pady=5)

        self.progress_var = tk.DoubleVar()
        ttk.Progressbar(status_frame, variable=self.progress_var, maximum=100).pack(side=tk.LEFT, fill=tk.X, expand=True, padx=10)

        # Start/Stop Training Button
        self.train_button = ttk.Button(status_frame, text="Start Training", command=self.toggle_training)
        self.train_button.pack(side=tk.RIGHT)

    def toggle_training(self):
        if self.train_button.cget('text') == "Start Training":
            self.start_training()
            self.train_button.config(text="Early Stop")
        else:
            self.stop_training()
            self.train_button.config(text="Start Training")

    def start_training(self):
        self.status_var.set("Status: Training...")
        self.progress_var.set(0)
        self.x_data = []
        self.train_loss_data = []
        self.val_loss_data = []
        self.train_acc_data = []
        self.val_acc_data = []
        self.is_training = True
        self.update_training()

    def stop_training(self):
        self.is_training = False
        self.status_var.set("Status: Training Stopped")

    def update_training(self):
        if not self.is_training:
            return

        progress = len(self.x_data)
        if progress >= 100:
            self.status_var.set("Status: Training Complete")
            self.train_button.config(text="Start Training")
            return

        self.progress_var.set(progress)
        self.x_data.append(progress)
        self.train_loss_data.append(1 - 0.5 * np.exp(-0.05 * progress) + 0.1 * np.random.randn())
        self.val_loss_data.append(1 - 0.4 * np.exp(-0.04 * progress) + 0.15 * np.random.randn())
        self.train_acc_data.append(0.5 + 0.4 * (1 - np.exp(-0.05 * progress)) + 0.05 * np.random.randn())
        self.val_acc_data.append(0.5 + 0.35 * (1 - np.exp(-0.04 * progress)) + 0.07 * np.random.randn())

        if progress % 5 == 0:  # Update plot every 5 steps
            self.loss_line.set_data(self.x_data, self.train_loss_data)
            self.val_loss_line.set_data(self.x_data, self.val_loss_data)
            self.acc_line.set_data(self.x_data, self.train_acc_data)
            self.val_acc_line.set_data(self.x_data, self.val_acc_data)

            for ax in (self.ax1, self.ax2):
                ax.relim()
                ax.autoscale_view()

            self.canvas.draw()

        self.master.after(50, self.update_training)

    def load_pretrain_model(self):
        print("Loading pre-trained model...")

    def save_threshold_file(self):
        print("Saving threshold file...")

    def save_model(self):
        print("Saving model...")

    def quantize_model(self):
        print("Quantizing model...")

    def export_model(self):
        print("Exporting model...")

if __name__ == "__main__":
    root = ThemedTk(theme="arc")
    app = ModelTrainingGUI(root)
    root.mainloop()