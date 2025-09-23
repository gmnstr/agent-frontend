import { Button, makeStyles, mergeClasses, shorthands, tokens } from '@fluentui/react-components'
import { DocumentText24Regular } from '@fluentui/react-icons'

export type DiffFile = {
  path: string
  additions: number
  deletions: number
  content: string
}

type CodeDiffViewerProps = {
  files: DiffFile[]
  selectedFile?: string
  onFileSelect: (path: string) => void
}

const useStyles = makeStyles({
  root: {
    display: 'grid',
    gridTemplateColumns: 'minmax(220px, 280px) minmax(0, 1fr)',
    gap: '1.25rem',
    minHeight: '20rem',
    '@media (max-width: 900px)': {
      gridTemplateColumns: '1fr',
    },
  },
  fileList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    borderRadius: '0.75rem',
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    backgroundColor: tokens.colorNeutralBackground2,
    ...shorthands.padding('1rem'),
    boxShadow: tokens.shadow2,
  },
  fileButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '0.75rem',
    width: '100%',
    borderRadius: '0.65rem',
    textAlign: 'left',
  },
  activeFile: {
    backgroundColor: tokens.colorNeutralBackground3,
  },
  diffStats: {
    fontFamily: tokens.fontFamilyMonospace,
    fontSize: '0.75rem',
  },
  diffContainer: {
    borderRadius: '0.75rem',
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.padding('1.25rem'),
    boxShadow: tokens.shadow2,
    overflowX: 'auto',
  },
  diffContent: {
    margin: 0,
    fontFamily: '"JetBrains Mono", "SFMono-Regular", "Menlo", monospace',
    fontSize: '0.85rem',
    lineHeight: 1.6,
    whiteSpace: 'pre',
  },
  placeholder: {
    display: 'grid',
    placeItems: 'center',
    color: tokens.colorNeutralForeground3,
    minHeight: '10rem',
  },
})

export const CodeDiffViewer = ({ files, selectedFile, onFileSelect }: CodeDiffViewerProps) => {
  const styles = useStyles()
  const activeFile = selectedFile ?? files[0]?.path
  const activeFileContent = files.find((file) => file.path === activeFile)?.content
  const activeIndex = Math.max(
    files.findIndex((file) => file.path === activeFile),
    0,
  )
  const panelId = 'diff-viewer-panel'

  if (files.length === 0) {
    return (
      <div className={styles.diffContainer} role="status" aria-live="polite">
        <div className={styles.placeholder}>No code changes to preview yet.</div>
      </div>
    )
  }

  return (
    <div className={styles.root}>
      <div className={styles.fileList} role="tablist" aria-label="Changed files">
        {files.map((file, index) => {
          const isActive = index === activeIndex
          const tabId = `diff-viewer-tab-${index}`
          const className = mergeClasses(styles.fileButton, isActive && styles.activeFile)

          return (
            <Button
              key={file.path}
              className={className}
              appearance={isActive ? 'secondary' : 'transparent'}
              icon={<DocumentText24Regular />}
              onClick={() => onFileSelect(file.path)}
              role="tab"
              aria-selected={isActive}
              id={tabId}
              aria-controls={panelId}
            >
              <span>{file.path}</span>
              <span className={styles.diffStats} aria-label="Diff summary">
                +{file.additions} / -{file.deletions}
              </span>
            </Button>
          )
        })}
      </div>
      <div
        className={styles.diffContainer}
        role="tabpanel"
        aria-live="polite"
        id={panelId}
        aria-labelledby={`diff-viewer-tab-${activeIndex}`}
      >
        {activeFileContent ? (
          <pre className={styles.diffContent}>{activeFileContent}</pre>
        ) : (
          <div className={styles.placeholder}>Select a file to view the diff preview.</div>
        )}
      </div>
    </div>
  )
}
