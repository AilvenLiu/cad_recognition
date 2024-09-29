import tkinter as tk
from tkinter import ttk
import tkinter.font as tkFont
from ttkthemes import ThemedTk

class ModelTrainingGUI:
    def __init__(self, master):
        self.master = master
        self.master.title("CAD Matching Model Training")
        self.master.geometry("1000x600")
        
        self.create_styles()
        self.create_widgets()

    def create_styles(self):
        self.title_font = tkFont.Font(family="Helvetica", size=16, weight="bold")
        self.header_font = tkFont.Font(family="Helvetica", size=12, weight="bold")
        self.text_font = tkFont.Font(family="Helvetica", size=10)

        style = ttk.Style()
        style.configure("TButton", padding=6, relief="flat", background="#4CAF50")
        style.configure("TLabel", padding=6, font=self.text_font)
        style.configure("Header.TLabel", font=self.header_font)
        style.configure("Title.TLabel", font=self.title_font)

    def create_widgets(self):
        main_frame = ttk.Frame(self.master, padding="10")
        main_frame.pack(fill=tk.BOTH, expand=True)

        # Title
        ttk.Label(main_frame, text="CAD Matching Model Training", style="Title.TLabel").pack(pady=10)

        # Notebook for different sections
        notebook = ttk.Notebook(main_frame)
        notebook.pack(fill=tk.BOTH, expand=True, pady=10)

        # Model Architecture Tab
        arch_frame = ttk.Frame(notebook, padding="10")
        notebook.add(arch_frame, text="Model Architecture")
        self.create_architecture_frame(arch_frame)

        # Loss Functions Tab
        loss_frame = ttk.Frame(notebook, padding="10")
        notebook.add(loss_frame, text="Loss Functions")
        self.create_loss_frame(loss_frame)

        # Training Strategy Tab
        train_frame = ttk.Frame(notebook, padding="10")
        notebook.add(train_frame, text="Training Strategy")
        self.create_training_frame(train_frame)

        # Data Processing Tab
        data_frame = ttk.Frame(notebook, padding="10")
        notebook.add(data_frame, text="Data Processing")
        self.create_data_frame(data_frame)

        # Evaluation Tab
        eval_frame = ttk.Frame(notebook, padding="10")
        notebook.add(eval_frame, text="Evaluation")
        self.create_evaluation_frame(eval_frame)

        # Start Training Button
        ttk.Button(main_frame, text="Start Training", command=self.start_training).pack(pady=10)

    def create_architecture_frame(self, parent):
        ttk.Label(parent, text="Teacher Model: ConvNeXt Tiny", style="Header.TLabel").pack(anchor="w", pady=5)
        ttk.Label(parent, text="Student Model: MobileNetV2", style="Header.TLabel").pack(anchor="w", pady=5)
        ttk.Label(parent, text="Both models modified for single-channel input", style="TLabel").pack(anchor="w")
        ttk.Label(parent, text="Added feature extraction and classification heads", style="TLabel").pack(anchor="w")

    def create_loss_frame(self, parent):
        losses = ["Triplet Loss", "NT-Xent Loss", "ArcFace Loss", "Classification Loss", "BYOL Loss", "Distillation Loss"]
        for loss in losses:
            ttk.Checkbutton(parent, text=loss).pack(anchor="w", pady=2)
        ttk.Label(parent, text="Dynamic weight balancing", style="TLabel").pack(anchor="w", pady=5)

    def create_training_frame(self, parent):
        ttk.Label(parent, text="Teacher-Student Model Structure", style="Header.TLabel").pack(anchor="w", pady=5)
        ttk.Label(parent, text="Optimizer: AdaBelief with Lookahead", style="TLabel").pack(anchor="w")
        ttk.Label(parent, text="Learning Rate Scheduling", style="TLabel").pack(anchor="w")
        ttk.Label(parent, text="Gradient Clipping", style="TLabel").pack(anchor="w")

    def create_data_frame(self, parent):
        ttk.Label(parent, text="Custom CombinedDataset with Triplet Sampling", style="Header.TLabel").pack(anchor="w", pady=5)
        augmentations = ["Random Flip", "Random Rotation", "Random Crop", "Color Jitter", "CLAHE Preprocessing"]
        for aug in augmentations:
            ttk.Checkbutton(parent, text=aug).pack(anchor="w", pady=2)

    def create_evaluation_frame(self, parent):
        ttk.Label(parent, text="Distance Metrics", style="Header.TLabel").pack(anchor="w", pady=5)
        ttk.Radiobutton(parent, text="Euclidean Distance").pack(anchor="w")
        ttk.Radiobutton(parent, text="Cosine Similarity").pack(anchor="w")
        ttk.Label(parent, text="Threshold Optimization", style="TLabel").pack(anchor="w", pady=5)
        ttk.Label(parent, text="Metrics: Classification Accuracy, Matching Accuracy, F1 Score", style="TLabel").pack(anchor="w")

    def start_training(self):
        print("Training started!")  # Placeholder for actual training function

if __name__ == "__main__":
    root = ThemedTk(theme="arc")  # Using a modern theme
    app = ModelTrainingGUI(root)
    root.mainloop()