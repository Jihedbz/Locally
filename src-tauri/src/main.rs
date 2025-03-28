use std::process::{Command, Stdio};
use std::path::PathBuf;
use tauri::{command, Manager};
use tokio::task;

#[command]
async fn create_project(name: String, path: String, template: String) -> Result<String, String> {
    // Validate the project name according to Angular's requirements
    let name_re = regex::Regex::new(r"^(?:@[a-zA-Z0-9-*~][a-zA-Z0-9-*._~]*/)?[a-zA-Z0-9-~][a-zA-Z0-9-._~]*$").unwrap();
    if !name_re.is_match(&name) {
        return Err(format!(
            "Invalid project name '{}'. Name must start with a letter and can only contain letters, numbers, dashes (-), dots (.), underscores (_), or tildes (~).",
            name
        ));
    }

    let base_path = PathBuf::from(&path);
    let project_path = if base_path.is_absolute() {
        base_path.clone()
    } else {
        std::env::current_dir().unwrap().join(&base_path)
    };
    let project_path = project_path.join(&name); // Ensure we are appending correctly


    println!("Base path: {}", base_path.display());
println!("Project path: {}", project_path.display());

    // Ensure the parent directory exists
    if let Some(parent) = project_path.parent() {
        std::fs::create_dir_all(parent).map_err(|e| e.to_string())?;
    }

    let command = match template.as_str() {
        "React" => format!("npx create-react-app {}", name),
        "Angular" => format!(
            "ng new {} --skip-install",
            name
        ),
        _ => return Err("Invalid template".to_string()),
    };

    let result = task::spawn_blocking(move || {
        let output = if cfg!(target_os = "windows") {
            Command::new("cmd")
                .args(["/C", &command])
                .current_dir(&base_path) // Use the base path as working directory
                .stdout(Stdio::piped())
                .stderr(Stdio::piped())
                .output()
                .map_err(|e| e.to_string())?
        } else {
            Command::new("sh")
                .arg("-c")
                .arg(command)
                .current_dir(&base_path) // Use the base path as working directory
                .stdout(Stdio::piped())
                .stderr(Stdio::piped())
                .output()
                .map_err(|e| e.to_string())?
        };

        if output.status.success() {
            Ok(format!("Project '{}' created successfully at '{}'", name, project_path.display()))
        } else {
            Err(format!(
                "Error creating project: {}\n{}",
                String::from_utf8_lossy(&output.stderr),
                String::from_utf8_lossy(&output.stdout)
            ))
        }
    }).await;

    result.map_err(|e| e.to_string())?
}



fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![create_project])

        .run(tauri::generate_context!())
        .expect("error while running Tauri application");
}
